# 📊 Project Architecture

This document explains how all the pieces fit together.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Chat Interface (React)              │  │
│  │  • Text input with image upload                      │  │
│  │  • Message list with streaming                       │  │
│  │  • Dynamic component rendering                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕ (HTTP/SSE)                      │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            /api/chat (Route Handler)                 │  │
│  │  • Receives messages + images                        │  │
│  │  • Calls OpenAI GPT-4o                              │  │
│  │  • Executes tools based on intent                   │  │
│  │  • Streams back text + React components             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      Vercel AI SDK                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  streamText() - Orchestrates AI conversation         │  │
│  │  • Manages conversation state                        │  │
│  │  • Handles tool calling                              │  │
│  │  • Streams responses                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                       OpenAI API                            │
│  • GPT-4o (text + vision)                                   │
│  • Understands user intent                                  │
│  • Decides which tools to call                              │
│  • Generates natural responses                              │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    Tool Execution Layer                      │
│  ┌──────────────┬──────────────┬──────────────────────┐     │
│  │get_order_    │process_      │search_products       │     │
│  │status        │return        │                      │     │
│  │              │              │                      │     │
│  │Returns:      │Returns:      │Returns:              │     │
│  │<TrackingCard>│<Resolution   │<ProductCarousel>     │     │
│  │              │Options>      │                      │     │
│  └──────────────┴──────────────┴──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer (MVP)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Mock Data (lib/mock-data.ts)            │  │
│  │  • MOCK_ORDERS array                                 │  │
│  │  • MOCK_PRODUCTS array                               │  │
│  │  • Helper functions                                  │  │
│  │                                                       │  │
│  │  [In Production: Supabase PostgreSQL]                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example

### Example: User asks "Where is my order?"

```
1. USER TYPES MESSAGE
   ↓
   "Where is my order?"
   ↓

2. CHAT INTERFACE (components/chat-interface.tsx)
   ↓
   • Captures input via useChat hook
   • POSTs to /api/chat with message
   ↓

3. API ROUTE (app/api/chat/route.tsx)
   ↓
   • Receives request
   • Calls streamText() with:
     - Model: GPT-4o
     - Messages: conversation history
     - Tools: 3 tool definitions
   ↓

4. OPENAI GPT-4o
   ↓
   • Analyzes: "User wants order status"
   • Generates: "I need their email"
   • Returns: Text response asking for email
   ↓

5. STREAM BACK TO USER
   ↓
   "I'd be happy to help! Could you provide your email?"
   ↓

6. USER PROVIDES EMAIL
   ↓
   "alex@example.com"
   ↓

7. OPENAI DECIDES TO CALL TOOL
   ↓
   • Tool: get_order_status
   • Parameters: { email: "alex@example.com" }
   ↓

8. TOOL EXECUTION
   ↓
   • Queries mock data
   • Finds order for alex@example.com
   • Returns <TrackingCard /> component
   ↓

9. COMPONENT STREAMS TO UI
   ↓
   • Beautiful visual tracking card appears
   • Shows order status, location, ETA
   • User sees app-like interface in chat
```

---

## 📁 File Structure Explained

```
agentic-support/
│
├── app/                              # Next.js App Router
│   ├── api/
│   │   └── chat/
│   │       └── route.tsx             # ⭐ THE BRAIN - AI orchestration
│   │                                 #    - Handles all AI logic
│   │                                 #    - Defines 3 tools
│   │                                 #    - Returns streaming responses
│   ├── layout.tsx                    # Root HTML structure
│   ├── page.tsx                      # Home page (renders ChatInterface)
│   └── globals.css                   # Global styles + Tailwind
│
├── components/                       # React Components
│   ├── chat-interface.tsx            # ⭐ MAIN UI - The chat window
│   │                                 #    - useChat hook for streaming
│   │                                 #    - Message list
│   │                                 #    - Input with image upload
│   │
│   ├── tracking-card.tsx             # ⭐ GENERATIVE UI - Order tracking
│   │                                 #    - Progress bar visualization
│   │                                 #    - Location & ETA display
│   │
│   ├── resolution-options.tsx        # ⭐ GENERATIVE UI - Return choices
│   │                                 #    - Store credit vs refund
│   │                                 #    - Visual comparison cards
│   │
│   └── product-carousel.tsx          # ⭐ GENERATIVE UI - Product results
│                                     #    - Product grid with images
│                                     #    - Add to cart buttons
│
├── lib/                              # Utility Code
│   ├── supabase.ts                   # Supabase client + TypeScript types
│   ├── mock-data.ts                  # ⭐ TEST DATA - Orders & products
│   │                                 #    - 3 test orders
│   │                                 #    - 5 test products
│   │                                 #    - Helper functions
│   │
│   └── utils.ts                      # cn() for Tailwind classes
│
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind CSS config
├── next.config.mjs                   # Next.js config
│
├── .env.local                        # ⭐ ENVIRONMENT VARIABLES
│                                     #    - OPENAI_API_KEY (required)
│                                     #    - Supabase keys (optional)
│
├── README.md                         # 📖 Full documentation
├── SETUP.md                          # 🚀 Quick start guide
├── DEMO.md                           # 🎬 Test scenarios
└── supabase-schema.sql               # 🗄️ Database schema (for production)
```

---

## 🛠️ Key Technologies

### Frontend Stack
```
┌─────────────────────┐
│      Next.js 14     │  ← React framework with App Router
│     (App Router)    │     - Server components
│                     │     - API routes
│                     │     - Streaming support
└─────────────────────┘
         ↓
┌─────────────────────┐
│     React 18        │  ← UI library
│   (Client & RSC)   │     - Server Components
│                     │     - Client Components
└─────────────────────┘
         ↓
┌─────────────────────┐
│   Tailwind CSS      │  ← Styling
│  (Mobile-first)    │     - Utility classes
│                     │     - Responsive design
└─────────────────────┘
```

### AI Stack
```
┌─────────────────────┐
│  Vercel AI SDK      │  ← AI orchestration
│   (ai package)      │     - streamText()
│                     │     - useChat() hook
│                     │     - Tool definitions
└─────────────────────┘
         ↓
┌─────────────────────┐
│  @ai-sdk/openai     │  ← OpenAI provider
│                     │     - GPT-4o integration
│                     │     - Vision support
└─────────────────────┘
         ↓
┌─────────────────────┐
│   OpenAI API        │  ← AI model
│    (GPT-4o)         │     - Text reasoning
│                     │     - Image analysis
│                     │     - Tool calling
└─────────────────────┘
```

### Backend Stack
```
┌─────────────────────┐
│   Next.js API       │  ← Server-side logic
│     Routes          │     - /api/chat endpoint
│                     │     - Tool execution
└─────────────────────┘
         ↓
┌─────────────────────┐
│  Mock Data (MVP)    │  ← Data layer
│  lib/mock-data.ts   │     - In-memory arrays
│                     │     - Helper functions
│  [Supabase later]   │     - PostgreSQL for prod
└─────────────────────┘
```

---

## 🎯 Tool Definition Pattern

Each tool follows this structure:

```typescript
toolName: tool({
  description: 'What this tool does',
  
  parameters: z.object({
    param1: z.string().describe('What param1 is'),
    param2: z.boolean().describe('What param2 is'),
  }),
  
  execute: async ({ param1, param2 }) => {
    // 1. Fetch data
    const data = getData(param1);
    
    // 2. Process/validate
    if (!data) {
      return { error: true, message: "Not found" };
    }
    
    // 3. Return component
    return {
      success: true,
      component: <MyComponent data={data} />
    };
  },
})
```

---

## 🔐 Security Considerations

### Current (MVP):
- ✅ Environment variables for API keys
- ✅ Server-side API calls only
- ⚠️ No authentication (open to all)
- ⚠️ Mock data (no real customer data)

### Production Ready:
- 🔒 Add NextAuth.js for authentication
- 🔒 Row-Level Security (RLS) in Supabase
- 🔒 Rate limiting on API routes
- 🔒 Input sanitization and validation
- 🔒 CORS configuration
- 🔒 API key rotation

---

## 📊 Data Flow Diagrams

### Order Tracking Flow
```
User Input
    ↓
"Where is my order?"
    ↓
AI detects intent: ORDER_TRACKING
    ↓
AI asks: "What's your email?"
    ↓
User provides: "alex@example.com"
    ↓
AI calls: get_order_status({ email: "alex@example.com" })
    ↓
Tool queries: MOCK_ORDERS.find(o => o.user_email === email)
    ↓
Tool returns: <TrackingCard {...order} />
    ↓
Component renders in chat
    ↓
User sees: Beautiful visual tracking card
```

### Product Search Flow
```
User Input
    ↓
"Do you have waterproof jackets?"
    ↓
AI detects intent: PRODUCT_SEARCH
    ↓
AI calls: search_products({ query: "waterproof jacket" })
    ↓
Tool queries: MOCK_PRODUCTS.filter(p => matches(p, query))
    ↓
Tool returns: <ProductCarousel products={results} />
    ↓
Component renders in chat
    ↓
User sees: Grid of matching products
```

---

## 🎨 Component Hierarchy

```
<ChatInterface>                         (components/chat-interface.tsx)
├── Header
│   └── Agent Info + Avatar
│
├── Messages Area (scrollable)
│   ├── Empty State (welcome message)
│   │   └── Quick Action Buttons
│   │
│   └── Message List
│       ├── User Message (right-aligned, blue)
│       └── Agent Message (left-aligned, white)
│           ├── Text Content
│           └── Tool Results
│               ├── <TrackingCard />
│               ├── <ResolutionOptions />
│               └── <ProductCarousel />
│
└── Input Area (sticky bottom)
    ├── Image Preview (if uploaded)
    ├── Text Input
    ├── Upload Button
    └── Send Button
```

---

## 🚀 Deployment Architecture

### Development (Current)
```
Local Machine
├── npm run dev
├── http://localhost:3000
└── Uses .env.local for keys
```

### Production (Recommended)
```
Vercel (Hosting)
├── Automatic deployments from Git
├── Edge Functions for /api/chat
├── Environment variables in dashboard
└── CDN for static assets

Supabase (Database)
├── PostgreSQL for orders/products
├── Row-Level Security (RLS)
├── Real-time subscriptions
└── Vector storage for embeddings

OpenAI (AI)
└── GPT-4o API calls
```

---

## 📈 Scaling Considerations

### Current Limits (MVP)
- 3 orders in mock data
- 5 products in mock data
- No caching
- No rate limiting

### Production Optimizations
- Move to Supabase for real database
- Add Redis for caching
- Implement CDN for images
- Add rate limiting per user
- Use vector search for products
- Add monitoring (Sentry, Datadog)
- Implement queue for slow operations

---

Ready to dive in? Check out [SETUP.md](SETUP.md) to get started!
