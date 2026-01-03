# 🤖 Agentic E-commerce Support Interface (MVP)

A next-generation customer support system powered by AI that goes beyond traditional chatbots. This system uses **Generative UI** to render dynamic React components directly in the chat stream, creating an app-like experience within a conversational interface.

## ✨ Features

### 🎯 Core Capabilities

1. **Visual Order Tracking (WISMO)**
   - Dynamic `TrackingCard` component with real-time status
   - Visual progress indicators (Ordered → Shipped → In Transit → Delivered)
   - Current location and ETA display
   - One-click issue reporting

2. **Multimodal Returns Processing**
   - Image upload and analysis for damaged items
   - AI-powered damage assessment (simulated in MVP)
   - `ResolutionOptions` component with visual comparison
   - Smart retention offers (store credit with bonus vs. refund)

3. **Intelligent Product Discovery**
   - Semantic search across product catalog
   - `ProductCarousel` component with instant "Add to Cart"
   - Stock level indicators
   - Responsive grid layout

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS (Apple-esque mobile-first design)
- **AI Orchestration:** Vercel AI SDK (Core & RSC)
- **Model:** OpenAI GPT-4o (with vision support)
- **Database:** Supabase (PostgreSQL) - with mock data for MVP
- **Icons:** Lucide React

## 📁 Project Structure

```
agentic-support/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.tsx          # AI chat API with tool definitions
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page (chat interface)
│   └── globals.css                # Global styles
├── components/
│   ├── chat-interface.tsx         # Main chat UI with useChat hook
│   ├── tracking-card.tsx          # Order tracking component
│   ├── resolution-options.tsx     # Return resolution component
│   └── product-carousel.tsx       # Product search results component
├── lib/
│   ├── supabase.ts               # Supabase client & types
│   ├── mock-data.ts              # Mock orders and products
│   └── utils.ts                  # Utility functions (cn)
└── [config files]
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key
- (Optional) Supabase account for production

### Installation

1. **Clone and install dependencies:**

```bash
cd /Users/anubhav_77_/Desktop/media.net
npm install
```

2. **Configure environment variables:**

Edit `.env.local` and add your API keys:

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here

# Optional (using mock data for MVP)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Start the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Testing the MVP

### Test Scenario 1: Order Tracking

1. In the chat, type: **"Where is my order?"**
2. When prompted, provide email: **alex@example.com**
3. 🎉 A visual `TrackingCard` will render showing:
   - Order status (In Transit)
   - Current location (Memphis, TN)
   - Progress bar with ETA
   - Order items and total

### Test Scenario 2: Returns with Image

1. Type: **"I want to return an item, it's damaged"**
2. Click the upload icon (📎) and upload any image
3. Provide order ID when asked: **ORD-2024-001**
4. 🎉 A `ResolutionOptions` card will render showing:
   - **Option 1 (Recommended):** Store Credit with $10 bonus
   - **Option 2:** Standard refund (5-7 days)

### Test Scenario 3: Product Search

1. Type: **"Do you have waterproof jackets for Iceland?"**
2. 🎉 A `ProductCarousel` will render showing:
   - Matching products with images
   - Prices and stock levels
   - "Add to Cart" buttons

## 🧪 Mock Data

The MVP uses realistic mock data in `lib/mock-data.ts`:

### Available Test Orders

| Email              | Order ID      | Status      | Location      |
|--------------------|---------------|-------------|---------------|
| alex@example.com   | ORD-2024-001  | In Transit  | Memphis, TN   |
| sarah@example.com  | ORD-2024-002  | Shipped     | Chicago, IL   |
| john@example.com   | ORD-2024-003  | Delivered   | San Francisco |

### Available Products

- Alpine Pro Waterproof Jacket ($189.99)
- Arctic Explorer Parka ($249.99)
- Storm Shield Rain Jacket ($129.99)
- Summit Thermal Base Layer ($79.99)
- Glacier Hiking Boots ($199.99)

## 🏗️ Architecture

### How Generative UI Works

1. **User Input:** User types a message or uploads an image
2. **AI Processing:** OpenAI GPT-4o analyzes intent
3. **Tool Invocation:** AI decides which tool to call based on context
4. **Component Rendering:** Tool returns React component
5. **Stream Response:** Component streams directly into chat UI

### Tool Definitions

The system uses three main tools defined in `app/api/chat/route.tsx`:

```typescript
1. get_order_status(email)
   → Returns: TrackingCard component

2. process_return(orderId, reason, hasImage)
   → Returns: ResolutionOptions component

3. search_products(query)
   → Returns: ProductCarousel component
```

## 🎨 Design Philosophy

- **Mobile-First:** Optimized for touch interactions
- **Apple-esque:** Clean, minimal, high trust aesthetic
- **Contextual:** UI adapts to user intent
- **Delightful:** Smooth animations and transitions
- **Accessible:** Semantic HTML and ARIA labels

## 📋 Next Steps (Beyond MVP)

### Immediate Enhancements

- [ ] Connect to real Supabase database
- [ ] Implement actual OpenAI Vision API for image analysis
- [ ] Add authentication and user sessions
- [ ] Wire up "Add to Cart" functionality
- [ ] Implement "Report Issue" action

### Future Features

- [ ] Real-time order updates via webhooks
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Sentiment analysis and escalation
- [ ] Analytics dashboard for support metrics
- [ ] Integration with Stripe for refunds
- [ ] Email notifications for resolutions

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Module not found" errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue:** API route returns 500 error
```bash
# Solution: Check .env.local has OPENAI_API_KEY set
cat .env.local | grep OPENAI_API_KEY
```

**Issue:** TypeScript errors in components
```bash
# Solution: Ensure all dependencies are installed
npm install @ai-sdk/openai zod
```

## 📚 Key Dependencies

- **ai** (v3.3.0): Vercel AI SDK for streaming and tools
- **@ai-sdk/google** (v0.0.48): Google Gemini provider for AI SDK
- **zod** (v3.23.8): Schema validation for tool parameters
- **next** (v14.2.0): React framework with App Router
- **lucide-react** (v0.400.0): Beautiful icon library

## 🤝 Contributing

This is an MVP project. To extend it:

1. Add new tools in `app/api/chat/route.tsx`
2. Create corresponding UI components in `components/`
3. Update mock data in `lib/mock-data.ts`
4. Test new flows in the chat interface

## 📄 License

MIT License - feel free to use this as a starting point for your own projects!

---

**Built with ❤️ using Next.js, Vercel AI SDK, and Google Gemini**
