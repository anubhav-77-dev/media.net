# 🚀 Quick Setup Guide

Follow these steps to get your Agentic Support Interface running in under 5 minutes!

## Step 1: Install Dependencies ✅

```bash
npm install
```

**Status:** ✅ Already completed!

## Step 2: Configure Environment Variables

You need to add your OpenAI API key to the `.env.local` file.

### Get your Gemini API Key:

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### Add the key to `.env.local`:

Open the `.env.local` file and replace `your_gemini_api_key_here` with your actual key:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-actual-gemini-key-here
```

**Note:** The Supabase keys are optional for the MVP since we're using mock data.

## Step 3: Start the Development Server

```bash
npm run dev
```

This will start the server at [http://localhost:3000](http://localhost:3000)

## Step 4: Test the Application

### 🧪 Test Scenario 1: Order Tracking
1. Open [http://localhost:3000](http://localhost:3000)
2. Type: "Where is my order?"
3. When asked, enter email: `alex@example.com`
4. ✨ You should see a beautiful tracking card!

### 🧪 Test Scenario 2: Product Search
1. Type: "Do you have waterproof jackets?"
2. ✨ You should see a product carousel with jacket options!

### 🧪 Test Scenario 3: Returns (with image)
1. Type: "I want to return an item, it's damaged"
2. Click the upload icon and select any image
3. When asked for order ID, enter: `ORD-2024-001`
4. ✨ You should see resolution options with store credit vs refund!

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Troubleshooting

### Error: "GOOGLE_GENERATIVE_AI_API_KEY is not set"
**Solution:** Make sure you've added your API key to `.env.local` and restart the dev server.

### Error: Module not found
**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
**Solution:** Either stop the other process or run on a different port:
```bash
PORT=3001 npm run dev
```

## What's Next?

Once you have it running, check out the [README.md](README.md) for:
- Architecture details
- How to extend the system
- Production deployment guide
- Supabase integration

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review the code comments in the components
- Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Check Vercel AI SDK docs: [sdk.vercel.ai](https://sdk.vercel.ai)

Happy coding! 🎉
