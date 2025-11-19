# Cloudflare AI Chatbot Setup Guide

## Overview

The Eurovolt website now features an AI-powered chatbot using Cloudflare Workers AI with the Llama 3.1 model.

## How It Works

1. **User sends a message** → Frontend (`chatbot.js`)
2. **API call to** `/api/chat` → Cloudflare Pages Function
3. **AI processes request** → Cloudflare Workers AI (Llama 3.1-8B)
4. **Response returned** → Displayed in chat

## Architecture

```
┌─────────────────┐
│  User Browser   │
│  (chatbot.js)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Cloudflare Pages        │
│ Function: /api/chat     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Cloudflare Workers AI   │
│ Model: Llama 3.1-8B     │
└─────────────────────────┘
```

## Files

- **`functions/api/chat.js`** - API endpoint that calls Workers AI
- **`static/js/chatbot.js`** - Frontend chat interface

## Setup Instructions

### 1. Enable Workers AI in Cloudflare Pages

The AI chatbot requires **Workers AI binding** to be enabled in your Cloudflare Pages project.

**Steps:**

1. Go to **Cloudflare Dashboard** → **Pages** → Your Project
2. Click **Settings** → **Functions**
3. Scroll to **Bindings**
4. Click **Add binding**
5. Select **Workers AI**
6. Name it: `AI`
7. Click **Save**

### 2. Deploy

Once the binding is added, simply push your code:

```bash
git push origin main
```

Cloudflare Pages will automatically deploy with AI enabled!

## Features

### ✅ AI-Powered Responses
- Uses Llama 3.1-8B Instruct model
- Context-aware about Eurovolt products
- Multilingual support (English, Chinese, Spanish, German, French)

### ✅ Fallback System
- If AI fails, automatically uses knowledge-base responses
- Ensures chatbot always works

### ✅ Company Knowledge
The AI is pre-trained with:
- Company information (location, certifications, partners)
- Product details (inverters, controllers, specifications)
- Technical knowledge (MPPT vs PWM, battery types, etc.)
- OEM/ODM services
- Contact information

## Customization

### Modify System Prompt

Edit `functions/api/chat.js` and update the `systemPrompt` variable to change:
- Company information
- Product details
- Response style
- Technical knowledge

### Adjust AI Parameters

In `functions/api/chat.js`, modify:

```javascript
const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
  messages: [...],
  max_tokens: 300,      // Increase for longer responses
  temperature: 0.7,     // 0.0-1.0 (lower = more focused)
  stream: false
});
```

### Change AI Model

Cloudflare supports multiple models. To use a different one:

```javascript
// Current: Llama 3.1-8B
'@cf/meta/llama-3.1-8b-instruct'

// Alternative models:
'@cf/meta/llama-3-8b-instruct'
'@cf/mistral/mistral-7b-instruct-v0.1'
'@cf/meta/llama-2-7b-chat-int8'
```

[See all available models](https://developers.cloudflare.com/workers-ai/models/)

## Testing Locally

Cloudflare Pages Functions work automatically when deployed, but for local testing:

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Run locally:
```bash
npx wrangler pages dev . --binding AI=@cf/meta/llama-3.1-8b-instruct
```

## Troubleshooting

### Issue: "AI is not defined"

**Solution:** Make sure Workers AI binding is added in Cloudflare Pages settings (see Setup step 1)

### Issue: Chat returns knowledge-base responses only

**Possible causes:**
1. AI binding not configured
2. AI quota exceeded (check Cloudflare dashboard)
3. Network error (check browser console)

**Check:** Browser console (F12) → Network tab → Look for `/api/chat` requests

### Issue: CORS errors

**Solution:** The function already includes CORS headers. If issues persist, check:
- Cloudflare Pages settings → Headers
- Browser console for specific error messages

## API Endpoint

### POST `/api/chat`

**Request:**
```json
{
  "message": "What is MPPT technology?",
  "language": "en"
}
```

**Response:**
```json
{
  "reply": "MPPT (Maximum Power Point Tracking) is...",
  "success": true
}
```

**Supported Languages:**
- `en` - English
- `zh` - Chinese
- `es` - Spanish
- `de` - German
- `fr` - French

## Cost

Cloudflare Workers AI pricing:
- **Free tier:** 10,000 requests/day
- **Paid:** $0.011 per 1,000 requests

[Learn more about pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)

## Security

- ✅ CORS enabled for frontend access
- ✅ Input validation (message required)
- ✅ Error handling with fallback
- ✅ No API keys exposed to frontend
- ✅ Rate limiting (Cloudflare automatic)

## Support

For issues or questions:
- Check browser console for errors
- Review Cloudflare Pages deployment logs
- Contact: info@eurovolt.com

## References

- [Cloudflare Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Pages Functions Guide](https://developers.cloudflare.com/pages/platform/functions/)
- [Llama 3.1 Model](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct/)
