# 🤖 Using Google Gemini API

This project has been configured to use **Google Gemini 2.0 Flash** instead of OpenAI.

## 🔑 Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key

## ⚙️ Configure Your Project

Open `.env.local` and add your key:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here
```

**Important:** Replace `your-gemini-api-key-here` with your actual API key from Google AI Studio.

## 🚀 Start Using Gemini

```bash
npm run dev
```

Open http://localhost:3000 and start chatting!

## 🎯 Gemini Model Used

This project uses **Gemini 2.0 Flash (Experimental)** which provides:
- ✅ Fast response times
- ✅ Multimodal support (text + images)
- ✅ Tool calling capabilities
- ✅ Long context window
- ✅ Cost-effective pricing

### Model: `gemini-2.0-flash-exp`

## 💡 Gemini vs OpenAI

**Advantages of Gemini:**
- Faster responses in many cases
- Better at reasoning tasks
- Native multimodal understanding
- More generous free tier
- Integrated with Google's ecosystem

**What Changed:**
- Package: `@ai-sdk/openai` → `@ai-sdk/google`
- Model: `gpt-4o` → `gemini-2.0-flash-exp`
- API Key: `OPENAI_API_KEY` → `GOOGLE_GENERATIVE_AI_API_KEY`
- Provider: `openai()` → `google()`

## 📊 Testing with Gemini

The same test scenarios work perfectly:

```
1. "Where is my order?" → alex@example.com
2. "Do you have waterproof jackets?"
3. "I want to return an item" → Upload image
```

Gemini will analyze the requests and render the same beautiful UI components!

## 🔧 Technical Details

### API Route Configuration
```typescript
import { google } from '@ai-sdk/google';

const result = await streamText({
  model: google('gemini-2.0-flash-exp'),
  messages,
  tools: { ... }
});
```

### Supported Features
- ✅ Streaming text responses
- ✅ Tool calling (3 tools implemented)
- ✅ Image analysis (multimodal)
- ✅ Long conversations
- ✅ Structured outputs

## 💰 Pricing

Gemini 2.0 Flash offers:
- **Free tier:** 15 requests per minute
- **Very cost-effective** for production use
- No credit card required for API key

Check latest pricing: https://ai.google.dev/pricing

## 🆘 Troubleshooting

### Error: "API key not valid"
- Verify you copied the complete key
- Check the key is active in Google AI Studio
- Ensure no extra spaces in `.env.local`

### Error: "Rate limit exceeded"
- Free tier: 15 requests/minute
- Wait a minute and try again
- Consider upgrading for higher limits

### Error: "Model not found"
- Gemini 2.0 Flash Exp is experimental
- If unavailable, change to `gemini-1.5-flash` in `app/api/chat/route.tsx`

## 🔄 Switch Models

To use a different Gemini model, edit `app/api/chat/route.tsx`:

```typescript
// Current (Gemini 2.0 Flash - Experimental)
model: google('gemini-2.0-flash-exp')

// Alternative: Gemini 1.5 Flash (Stable)
model: google('gemini-1.5-flash')

// Alternative: Gemini 1.5 Pro (More capable)
model: google('gemini-1.5-pro')
```

## 📚 Resources

- Google AI Studio: https://aistudio.google.com
- Gemini API Docs: https://ai.google.dev/docs
- Vercel AI SDK: https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai
- Pricing: https://ai.google.dev/pricing

## ✅ You're All Set!

Gemini is now powering your Agentic Support Interface. Start the dev server and test it out! 🚀

```bash
npm run dev
```

---

**Need help?** Check [SETUP.md](SETUP.md) for general setup or [README.md](README.md) for full documentation.
