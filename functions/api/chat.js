// Cloudflare Pages Function for AI Chat
// Uses Cloudflare Workers AI (Llama model)

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // Get the message from request body
    const { message, language = 'en' } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // System prompt with Eurovolt context
    const systemPrompt = `You are a helpful AI assistant for Eurovolt, a leading solar electronics manufacturer based in Shenzhen, China.

COMPANY INFORMATION:
- Founded: 2020
- Location: Shenzhen, China
- Specialization: Solar inverters, MPPT & PWM charge controllers
- Manufacturing: 50,000+ m² facility, 500+ employees, 12 production lines
- Certifications: ISO 9001, CE, UL, IEC 62109
- Partners: NEXT, POWMr, SUMRy, EASUN POWER, MUST, ANERN

PRODUCTS:
1. HYBRID INVERTERS (MEGA/MAGIC series):
   - MEGA-6KW, MEGA-8KW, MEGA-10KW (single-phase, 6-10KW)
   - MAGIC-10KW, MAGIC-12KW (3-phase, 10-12KW)
   - Features: Dual/Triple MPPT, touchscreen, WiFi, parallel operation
   - Efficiency: 97%+

2. ON-GRID INVERTERS (MATE series):
   - MATE-3KW to MATE-15KW
   - IP65 rated, high efficiency, WiFi monitoring
   - Multiple MPPT trackers

3. MPPT CHARGE CONTROLLERS:
   - 30A-100A capacity
   - 99.5% efficiency
   - LCD display, smart programming
   - Advanced algorithms for maximum power harvesting

4. PWM CHARGE CONTROLLERS:
   - 10A-60A range
   - Intelligent battery management
   - Reliable and cost-effective

KEY TECHNOLOGIES:
- MPPT: 20-30% more efficient than PWM, works with higher voltage panels
- Battery Management: Supports lithium-ion and lead-acid
- IoT Integration: WiFi monitoring, mobile apps, cloud connectivity
- Sustainable Manufacturing: 95% waste recycling, 100% renewable energy

SERVICES:
- OEM/ODM manufacturing available
- Global shipping from Shenzhen
- 5-year warranties on inverters/MPPT, 3-year on PWM
- 24/7 technical support

CONTACT:
- Email: info@eurovolt.com
- Phone: +86 755 1234 5678
- Website: Contact page for quotes

INSTRUCTIONS:
- Be friendly, professional, and helpful
- Provide accurate technical information
- Recommend products based on customer needs
- Direct complex quotes to the contact team
- Keep responses concise (2-4 sentences)
- Use the customer's language (${language})
- If unsure, suggest contacting the sales team`;

    // Call Cloudflare Workers AI
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
      temperature: 0.7,
      stream: false
    });

    // Extract the response
    const reply = aiResponse.response || 'I apologize, but I encountered an issue processing your request. Please try again or contact us at info@eurovolt.com.';

    return new Response(JSON.stringify({
      reply,
      success: true
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('AI Chat Error:', error);

    return new Response(JSON.stringify({
      error: 'Failed to process chat request',
      reply: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact us at info@eurovolt.com for immediate assistance.',
      success: false
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
