import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getOrderByEmail, searchProducts, analyzeReturnImage, MOCK_ORDERS } from '@/lib/mock-data';
import { TrackingCard } from '@/components/tracking-card';
import { ResolutionOptions } from '@/components/resolution-options';
import { ProductCarousel } from '@/components/product-carousel';
import { searchKnowledge, searchPolicies, getProductStats } from '@/lib/rag-store';
import { analyzeImageForDamage } from '@/lib/vision-analysis';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, image } = await req.json();

  // Detect if user just uploaded an image
  const hasUploadedImage = !!image;
  
  // Add image indicator to system context if image was uploaded
  const imageContext = hasUploadedImage 
    ? '\n\n🖼️ USER HAS UPLOADED AN IMAGE: The user has attached a photo in their last message. This image can be analyzed for damage assessment in returns.'
    : '';

  const result = await streamText({
    model: google('gemini-2.5-pro'),
    messages,
    system: `You are a friendly and helpful customer support agent for an e-commerce brand with access to our full product catalog and policies. Your goal is to provide exceptional, personalized service through natural conversation.${imageContext}

CONVERSATION CONTEXT:
- You have access to the full chat history with this customer
- Use previous messages to understand customer context and preferences
- Reference past information to provide personalized follow-ups
- Build on earlier points discussed - don't repeat yourself
- If a customer mentions a product or brand earlier, remember it for context
- Use conversation history to improve relevance of recommendations

PERSONALITY & TONE:
- Be warm, empathetic, and conversational
- Use natural language, not robotic responses
- Show genuine interest in helping customers
- After showing information (tracking, products, etc.), ask if they need anything else or have questions
- Handle general questions and chitchat naturally before guiding to support topics

AVAILABLE TOOLS - WHICH TO USE WHEN:
- get_order_status: For tracking orders (user provides email)
- process_return: For return/refund requests (user provides order ID)
- search_knowledge: For ALL product searches, brand questions, category questions, and policy questions
- search_products: DO NOT USE THIS TOOL - it is deprecated

KEY RULE: For any question about products, brands, categories, or policies - ALWAYS use search_knowledge, NEVER use search_products.

WORKFLOW:
1. For order tracking:
   - If user asks about their order, ask for their email if not provided
   - Use get_order_status tool to show tracking details
   - After showing tracking info, ask if they have questions or need help with anything else

2. For returns:
   - First ask for the order number
   - Then ask "What is the reason for the return?"
   - CRITICAL: After they provide the reason, you MUST ask them to upload a photo:
     * Say: "Could you please upload a photo of the [item/damage]? Click the upload icon next to the message box to attach an image. This will help us process your return faster."
     * DO NOT call process_return until they upload an image OR explicitly say they don't have one
   - Once you see "🖼️ USER HAS UPLOADED AN IMAGE" in the system context, acknowledge the image and call process_return with hasImage=true
   - If user says they don't have an image, use process_return with hasImage=false
   - The vision AI will analyze the image for damage and detect if it's AI-generated/fake
   - Guide them through the resolution options after analysis

3. For product searches and questions:
   - For ANY product question (\"Do you have running shoes?\", \"What brands do you carry?\", \"waterproof jackets?\"), ALWAYS use search_knowledge
   - For policy questions (shipping, returns, payment, warranty), use search_knowledge
   - The search_knowledge tool searches our full product catalog and policy database
   - After providing information, offer to help find specific products or answer more questions
   - Remember earlier product inquiries and use them for context

4. For general conversation:
   - Answer questions naturally
   - Provide helpful information using search_knowledge when needed
   - Guide conversations toward actionable support when appropriate

IMPORTANT:
- Use the full conversation history - this helps you understand customer needs better
- After using any tool, continue the conversation naturally based on what you've learned
- Ask follow-up questions to ensure the customer is satisfied
- Be proactive in offering additional help
- Keep responses concise but friendly
- Use search_knowledge for product availability, brands, categories, and all policy questions
- NEVER use search_products - it is deprecated

Remember: You have the full message history. Reference it to provide better, more personalized support.`,
    tools: {
      get_order_status: tool({
        description: 'Get the current status and tracking information for a customer order by email address',
        parameters: z.object({
          email: z.string().email().describe('The customer email address associated with the order'),
        }),
        execute: async ({ email }) => {
          const order = getOrderByEmail(email);
          
          if (!order) {
            return {
              type: 'error',
              message: `I couldn't find any orders associated with ${email}. Please check the email address or contact support.`,
            };
          }

          return {
            type: 'tracking_card',
            data: {
              orderId: order.id,
              status: order.status,
              currentLocation: order.current_location,
              estimatedDelivery: order.estimated_delivery,
              trackingNumber: order.tracking_number,
              items: order.items,
            },
          };
        },
      }),

      process_return: tool({
        description: 'Process a return request, analyze uploaded images using AI vision to detect damage and synthetic images, and present resolution options',
        parameters: z.object({
          orderId: z.string().describe('The order ID for the return'),
          reason: z.string().describe('The reason for the return'),
          hasImage: z.boolean().describe('Whether the user uploaded an image of the issue'),
        }),
        execute: async ({ orderId, reason, hasImage }) => {
          // Find the order (accept any order ID for mockup)
          const order = MOCK_ORDERS.find(o => o.id === orderId);
          
          // Use found order or generate mock order value
          const orderValue = order ? 
            order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 
            Math.floor(Math.random() * 200) + 50; // Random value between $50-$250 for any order ID

          // Analyze image if provided
          let visionAnalysis = null;
          let defectSeverity: 'minor' | 'moderate' | 'severe' = 'moderate';
          let suspiciousFlags: string[] = [];
          let trustScore = 100;

          if (hasImage && image) {
            try {
              visionAnalysis = await analyzeImageForDamage(image);
              defectSeverity = visionAnalysis.severity as 'minor' | 'moderate' | 'severe';
              suspiciousFlags = visionAnalysis.suspiciousFlags;
              trustScore = visionAnalysis.trustScore;
              
              console.log('[VISION] Image analysis complete:', {
                damage: visionAnalysis.hasDamage,
                synthetic: visionAnalysis.isSyntheticImage,
                confidence: visionAnalysis.syntheticConfidence,
                trustScore,
                recommendation: visionAnalysis.recommendation,
              });
            } catch (error) {
              console.error('[VISION] Error analyzing image:', error);
              suspiciousFlags.push('⚠️ Error analyzing image - manual review required');
            }
          }

          const isRejected = visionAnalysis?.syntheticConfidence && visionAnalysis.syntheticConfidence > 60 || trustScore < 40;

          if (isRejected) {
            return {
              type: 'rejection_notice',
              data: {
                orderId,
                reason,
                suspiciousFlags,
                trustScore,
                visionAnalysis: visionAnalysis ? {
                  hasDamage: visionAnalysis.hasDamage,
                  severity: visionAnalysis.severity,
                  damageDescription: visionAnalysis.damageDescription,
                  isSynthetic: visionAnalysis.isSyntheticImage,
                  syntheticConfidence: visionAnalysis.syntheticConfidence,
                  recommendation: visionAnalysis.recommendation,
                } : null,
              },
            };
          }

          return {
            type: 'resolution_options',
            data: {
              orderId,
              orderValue,
              defectSeverity,
              reason,
              suspiciousFlags,
              trustScore,
              visionAnalysis: visionAnalysis ? {
                hasDamage: visionAnalysis.hasDamage,
                severity: visionAnalysis.severity,
                damageDescription: visionAnalysis.damageDescription,
                isSynthetic: visionAnalysis.isSyntheticImage,
                syntheticConfidence: visionAnalysis.syntheticConfidence,
                recommendation: visionAnalysis.recommendation,
              } : null,
            },
          };
        },
      }),

      search_products: tool({
        description: '**DEPRECATED - DO NOT USE** - This tool is no longer used. Use search_knowledge instead for all product searches, brand queries, and policies.',
        parameters: z.object({
          query: z.string().describe('DEPRECATED - Use search_knowledge tool instead'),
        }),
        execute: async ({ query }) => {
          console.log('[DEPRECATED] search_products called - should use search_knowledge instead');
          return {
            type: 'error',
            message: `This tool is deprecated. Please use search_knowledge for product searches.`,
          };
        },
      }),

      search_knowledge: tool({
        description: 'Search the product catalog and policy database for information. Use this for questions about product availability, brands, categories, policies (returns, shipping, payment, warranty), or general product information.',
        parameters: z.object({
          query: z.string().describe('The search query (e.g., "running shoes", "return policy", "do you have Nike products?")'),
        }),
        execute: async ({ query }) => {
          const queryLower = query.toLowerCase();
          
          // Check for policy questions first
          const policyAnswer = searchPolicies(query);
          if (policyAnswer) {
            return { type: 'knowledge_answer', message: policyAnswer };
          }

          // Check if asking about brands/categories in general (do this FIRST before product search)
          if (queryLower.includes('brand') && (queryLower.includes('what') || queryLower.includes('which') || 
              queryLower.includes('all') || queryLower.includes('carry') || queryLower.includes('sell'))) {
            const stats = getProductStats();
            return { 
              type: 'knowledge_answer',
              message: `We carry ${stats.totalBrands}+ brands across ${stats.totalCategories} categories. Popular brands include ${stats.sampleBrands.slice(0, 8).join(', ')}, and many more.` 
            };
          }

          // Search for specific products
          const results = searchKnowledge(query, 5);

          if (results.length === 0) {
            return { 
              type: 'knowledge_answer',
              message: `I couldn't find products matching that specific search. We have ${getProductStats().totalProducts} items available. Feel free to ask about a specific brand, category, or try searching with different keywords!` 
            };
          }

          // Check query type for conversational response
          let conversationalMsg = '';
          
          if (queryLower.includes('shoe')) {
            conversationalMsg = `Yes! We have some great shoe options. Here are a few that might interest you:`;
          } else if (queryLower.includes('running')) {
            conversationalMsg = `Absolutely! We carry running gear. Check out these options:`;
          } else if (queryLower.includes('shirt') || queryLower.includes('clothing') || queryLower.includes('apparel')) {
            conversationalMsg = `Great choice! We have several clothing items. Here are some recommendations:`;
          } else if (queryLower.includes('electronic') || queryLower.includes('gadget')) {
            conversationalMsg = `Yes, we have electronics! Here are some popular options:`;
          } else {
            conversationalMsg = `Great question! Here are some items we have that match what you're looking for:`;
          }

          // Format as structured data for component rendering
          const matches = results.slice(0, 3).map(result => {
            const p = result.product;
            // Clean up price - handle scientific notation
            let price = 'N/A';
            if (p.final_price) {
              const priceNum = parseFloat(p.final_price.toString().replace(/"/g, ''));
              price = isNaN(priceNum) ? 'N/A' : priceNum.toFixed(2);
            }

            return {
              title: p.title ? p.title.substring(0, 100) : 'Unknown Product',
              brand: p.brand || 'Unknown',
              price: price,
              rating: p.rating || '',
              stock: p.availability === 'In Stock',
            };
          });

          return {
            type: 'knowledge_answer',
            message: conversationalMsg,
            matches,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
