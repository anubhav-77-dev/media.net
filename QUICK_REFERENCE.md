# 🚀 Quick Reference

> One-page reference for the most important commands and test data

## ⚡ Essential Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 🔑 Environment Setup

Edit `.env.local`:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here
```

Get your key: https://aistudio.google.com/app/apikey

## 🧪 Test Data Quick Reference

### Test Emails for Order Tracking
```
alex@example.com   → In Transit, Memphis TN
sarah@example.com  → Shipped, Chicago IL
john@example.com   → Delivered, San Francisco CA
```

### Test Order IDs for Returns
```
ORD-2024-001  → $249.98 (2 items)
ORD-2024-002  → $129.99 (1 item)
ORD-2024-003  → $69.98 (2 items)
```

### Product Search Keywords
```
"waterproof jacket" → 3 results
"hiking boots"      → 1 result
"thermal"           → 1 result
"jacket"            → 3 results
```

## 💬 Test Prompts

Copy-paste these into the chat:

```
1. "Where is my order?"
   Then: alex@example.com

2. "Do you have waterproof jackets for Iceland?"

3. "I want to return an item, it's damaged"
   Upload any image
   Then: ORD-2024-001
```

## 📊 Component Reference

```
TrackingCard         → Order status with progress bar
ResolutionOptions    → Store credit vs refund comparison
ProductCarousel      → Product grid with Add to Cart
```

## 🛠️ Useful File Paths

```
Main chat UI:        components/chat-interface.tsx
AI logic:            app/api/chat/route.tsx
Mock data:           lib/mock-data.ts
Styles:              app/globals.css
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found" | `npm install` |
| "GOOGLE_GENERATIVE_AI_API_KEY not set" | Add key to `.env.local` |
| Port 3000 in use | `PORT=3001 npm run dev` |
| TypeScript errors | Check all imports |

## 📱 Testing Checklist

- [ ] Order tracking works
- [ ] Product search works
- [ ] Return flow with image works
- [ ] Mobile responsive
- [ ] No console errors

## 🎯 Project URLs

- Dev server: http://localhost:3000
- Gemini API keys: https://aistudio.google.com/app/apikey
- Vercel AI SDK: https://sdk.vercel.ai
- Next.js docs: https://nextjs.org/docs

## 📚 Documentation

- [SETUP.md](SETUP.md) - First-time setup
- [DEMO.md](DEMO.md) - Test scenarios
- [README.md](README.md) - Full docs
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical design
- [CHECKLIST.md](CHECKLIST.md) - Completion guide

---

**Quick Start:** `npm install` → Add OpenAI key to `.env.local` → `npm run dev` → Test!
