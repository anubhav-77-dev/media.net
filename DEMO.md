# 🎬 Demo Scenarios & Expected Behaviors

This document outlines the exact user flows and what you should see when testing the Agentic Support Interface.

---

## 📦 Scenario 1: Order Tracking (WISMO)

### User Flow:
```
User: "Where is my order?"
Agent: "I'd be happy to help you track your order! Could you please provide your email address?"
User: "alex@example.com"
Agent: [Calls get_order_status tool]
```

### Expected UI:
A beautiful **TrackingCard** component appears with:
- ✅ Order number: ORD-2024-001
- ✅ Progress bar showing "In Transit" (3rd of 4 stages)
- ✅ Current location: Memphis, TN
- ✅ Estimated delivery: Jan 5, 2026
- ✅ List of items:
  - Waterproof Hiking Jacket - $159.99
  - Thermal Base Layer Set - $89.99
- ✅ Total: $249.98
- ✅ "Report an Issue" button at bottom

### Alternative Test Emails:
| Email | Status | Location |
|-------|--------|----------|
| `alex@example.com` | In Transit | Memphis, TN |
| `sarah@example.com` | Shipped | Chicago, IL |
| `john@example.com` | Delivered | San Francisco, CA |

---

## 🔄 Scenario 2: Product Search (RAG)

### User Flow:
```
User: "Do you have waterproof jackets for Iceland?"
Agent: [Calls search_products tool with query "waterproof jacket Iceland"]
```

### Expected UI:
A **ProductCarousel** component appears showing 3 matching products:

1. **Alpine Pro Waterproof Jacket** - $189.99
   - 45 in stock
   - "Add to Cart" button

2. **Arctic Explorer Parka** - $249.99
   - 23 in stock (with "Only 23 left" badge)
   - "Add to Cart" button

3. **Storm Shield Rain Jacket** - $129.99
   - 67 in stock
   - "Add to Cart" button

Each card includes:
- Product image
- Short description
- Price (large and bold)
- Stock indicator
- Interactive "Add to Cart" button

### Alternative Search Queries:
- "hiking boots" → Shows Glacier Hiking Boots
- "thermal layer" → Shows Summit Thermal Base Layer
- "jacket" → Shows all 3 jacket options

---

## 🖼️ Scenario 3: Return with Image Analysis

### User Flow:
```
User: "I want to return an item, it's damaged"
Agent: "I'm sorry to hear that! I'd be happy to help. Could you please provide your order number?"
User: "ORD-2024-001"
Agent: "Thank you. Could you please upload a photo of the damage so I can better assist you?"
User: [Uploads any image using the upload button]
Agent: [Calls process_return tool with image analysis]
```

### Expected UI:
A **ResolutionOptions** component appears with two side-by-side cards:

#### Option 1 (Recommended - Green Border):
- 🏷️ Badge: "Best Value" with sparkle icon
- 🎁 Title: "Instant Store Credit"
- 💰 Value: **$259.98** (crossed out $249.98)
  - Shows "+$10 bonus credit" in green
- ✅ Benefits:
  - Available immediately
  - No waiting for processing
  - Never expires

#### Option 2 (Standard - Gray Border):
- 💳 Title: "Original Payment Refund"
- 💰 Value: **$249.98**
  - Shows "Refunded to original payment method"
- ⏰ Benefits:
  - 5-7 business days processing
  - Return shipping required
  - Full inspection process

At the bottom:
- 💡 Tip box explaining the store credit advantage

### Simulated Damage Detection:
For the MVP, all images are analyzed with these results:
- `defect_detected: true`
- `severity: 'moderate'`
- `description: "Product shows visible signs of damage..."`

In production, this would use GPT-4o Vision to actually analyze the image.

---

## 🎯 Advanced Scenarios

### Scenario 4: No Order Found
```
User: "Where is my order?"
Agent: "Could you provide your email?"
User: "notfound@example.com"
Agent: "I couldn't find any orders associated with notfound@example.com. Please check the email address or contact support."
```
**Expected:** Error message, no component rendered.

### Scenario 5: No Products Found
```
User: "Do you have ski poles?"
Agent: [Searches for "ski poles"]
Agent: "I couldn't find any products matching 'ski poles'. Would you like to try a different search?"
```
**Expected:** Text response only, no carousel.

### Scenario 6: Multi-turn Conversation
```
User: "I need help"
Agent: "I'm here to help! What can I assist you with today?"
User: "My package"
Agent: "I'd be happy to help track your package. Could you provide your email?"
User: "alex@example.com"
Agent: [Shows TrackingCard]
```
**Expected:** Natural conversation leading to component render.

---

## 🎨 Design Elements to Notice

### Visual Polish:
- ✨ Smooth animations when components appear
- 🎨 Gradient backgrounds on badges and headers
- 🔵 Progress indicators with color coding
- 📱 Responsive design (try resizing your browser)
- 🖱️ Hover states on all buttons

### Typography:
- Font stack: System fonts (SF Pro on Mac, Segoe UI on Windows)
- Clean hierarchy: Bold headings, regular body text
- Proper spacing and breathing room

### Color Scheme:
- Primary: Blue (orders, actions)
- Success: Green (store credit, recommended)
- Warning: Orange (low stock)
- Neutral: Gray (secondary info)

---

## 📊 Testing Checklist

Use this checklist to verify all features work:

- [ ] Order tracking shows for alex@example.com
- [ ] Order tracking shows for sarah@example.com
- [ ] Order tracking shows for john@example.com
- [ ] Product search returns results for "jacket"
- [ ] Product search returns results for "boots"
- [ ] Product search returns results for "thermal"
- [ ] Return flow accepts image upload
- [ ] Return flow shows resolution options
- [ ] Store credit option is visually highlighted
- [ ] Chat input clears after sending
- [ ] Loading indicator appears while AI thinks
- [ ] Components are mobile-responsive
- [ ] All buttons have hover states
- [ ] Error handling for invalid email
- [ ] Suggested prompts work when clicked

---

## 🚀 Performance Expectations

### Speed:
- First message response: < 2 seconds
- Component render: Instant (streams in)
- Image upload: < 1 second
- Product search: < 1.5 seconds

### Streaming:
- Text should appear word-by-word (streaming)
- Components should pop in smoothly
- No jarring layout shifts

---

## 💡 Pro Tips for Demo

1. **Start with order tracking** - It's the most visually impressive
2. **Show the image upload** - Demonstrates multimodal capability
3. **Highlight the "Best Value" badge** - Shows smart retention logic
4. **Try mobile view** - Demonstrates responsive design
5. **Show the error case** - Use invalid email to show error handling

---

## 🎥 Demo Script (5 minutes)

Perfect for showing stakeholders:

```
1. [0:00-0:30] Introduction
   "This is an AI-powered support agent that goes beyond text responses..."

2. [0:30-1:30] Order Tracking
   Type: "Where is my order?"
   Email: alex@example.com
   "Notice the visual tracking card with real-time status..."

3. [1:30-2:30] Product Search
   Type: "Do you have waterproof jackets for Iceland?"
   "The AI understands context and shows relevant products instantly..."

4. [2:30-4:00] Returns Flow
   Type: "I want to return an item, it's damaged"
   Upload image
   Order: ORD-2024-001
   "The AI analyzes the image and offers smart retention options..."

5. [4:00-5:00] Wrap-up
   "This creates an app-like experience within a chat interface..."
```

---

Ready to test? Start with [SETUP.md](SETUP.md) to get running!
