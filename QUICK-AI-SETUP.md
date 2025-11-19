# Quick AI Binding Setup

Your site is deployed at: **https://03b3d0ca.eurovoltgreen.pages.dev**

## Enable AI Chatbot - Final Step

The AI binding needs to be added through the Cloudflare Dashboard (one-time setup).

### Method 1: Using Cloudflare Dashboard (Easiest)

1. **Go to**: https://dash.cloudflare.com/
2. **Click**: Workers & Pages → **eurovoltgreen**
3. **Click**: Settings → **Functions**
4. **Scroll to**: Bindings section
5. **Click**: + Add binding
6. **Select**: Workers AI
7. **Variable name**: `AI` (must be exactly this)
8. **Click**: Save

### Method 2: Using Wrangler CLI

Run this command:

```bash
wrangler pages deployment create eurovoltgreen --branch=main --ai=AI
```

Or configure via Wrangler (requires API):

```bash
# This requires Cloudflare API token with Pages edit permissions
curl -X PATCH \
  "https://api.cloudflare.com/client/v4/accounts/fba2eb8c1f67996b268a0f108405f6ae/pages/projects/eurovoltgreen" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "deployment_configs": {
      "production": {
        "ai_bindings": {
          "AI": {}
        }
      }
    }
  }'
```

## Test Your AI Chatbot

Once the binding is added:

1. Visit: https://03b3d0ca.eurovoltgreen.pages.dev
2. Click the **Chat** button (green button in navbar)
3. Ask: "What is MPPT technology?"

**With AI enabled**: Intelligent, contextual response
**Without AI**: Fallback to knowledge-base response

## Verify AI is Working

Open browser console (F12) → Network tab:
- Look for request to `/api/chat`
- Check the response - if it has `success: true`, AI is working!

## Files Created

- ✅ `wrangler.toml` - Wrangler configuration
- ✅ `functions/api/chat.js` - AI API endpoint
- ✅ Updated `chatbot.js` - Frontend integration
- ✅ `AI-CHATBOT-SETUP.md` - Full documentation

## Your Deployments

- **Latest**: https://03b3d0ca.eurovoltgreen.pages.dev
- **Production**: https://eurovoltgreen.pages.dev

## Need Help?

Check `AI-CHATBOT-SETUP.md` for detailed troubleshooting.
