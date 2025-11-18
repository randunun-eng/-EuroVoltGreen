import os
import logging
from openai import OpenAI

# Check if API key is configured
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    logging.warning("OPENAI_API_KEY not found. Chatbot will use fallback responses. Set OPENAI_API_KEY environment variable for AI-powered responses.")

# Initialize OpenAI client with OpenRouter only if API key exists
client = None
if API_KEY:
    try:
        client = OpenAI(
            api_key=API_KEY,
            base_url="https://openrouter.ai/api/v1"
        )
    except Exception as e:
        logging.error(f"Failed to initialize OpenAI client: {e}")

def get_fallback_response(question: str, language: str = 'en') -> str:
    """
    Provide fallback responses for common solar-related questions
    """
    question_lower = question.lower()

    # Common solar questions and answers
    fallback_responses = {
        'en': {
            'mppt': "MPPT (Maximum Power Point Tracking) is an advanced technology that optimizes solar panel output by continuously adjusting the electrical operating point. Our MPPT controllers can increase solar harvest by up to 30% compared to traditional PWM controllers, especially effective in cold weather or partially shaded conditions.",

            'pwm': "PWM (Pulse Width Modulation) controllers are cost-effective solar charge controllers suitable for smaller systems. They work by gradually reducing the amount of power applied to batteries as they become fully charged. While simpler than MPPT, they're reliable and efficient for many applications.",

            'inverter': "Our hybrid inverters convert DC power from solar panels and batteries into AC power for your home or business. They feature advanced MPPT technology, WiFi monitoring, and can work with both on-grid and off-grid systems. We offer models from 5kW to 15kW to suit different power requirements.",

            'installation': "For installation, we recommend:\n1. Position panels facing south (north in southern hemisphere) at an optimal tilt angle\n2. Ensure proper ventilation for inverters\n3. Use appropriate wire gauge for the distance\n4. Follow all local electrical codes\n5. Consider professional installation for systems over 3kW\n\nContact us for detailed installation guides specific to your chosen products.",

            'warranty': "All Eurovolt products come with a comprehensive 5-year warranty covering manufacturing defects and component failures. Extended warranties up to 10 years are available for select models. We provide global support and have replacement parts readily available.",

            'contact': "You can reach us:\n📧 Email: info@eurovolt.com\n📞 Phone: +86 755 1234 5678\n📍 Location: Shenzhen, China\n\nOur technical support team is available Monday-Friday, 9 AM - 6 PM CST. For urgent matters, please mention 'URGENT' in your subject line.",

            'default': "Thank you for your question! As a leading solar equipment manufacturer, Eurovolt specializes in:\n\n✓ Hybrid Solar Inverters (5kW-15kW)\n✓ MPPT Charge Controllers\n✓ PWM Charge Controllers\n\nFor specific product information, please visit our Products page or contact our sales team. For technical questions, our support team is ready to help!"
        },
        'zh': {
            'mppt': "MPPT（最大功率点跟踪）是一种先进技术，通过不断调整电气工作点来优化太阳能板输出。与传统PWM控制器相比，我们的MPPT控制器可将太阳能收集量提高30%，在寒冷天气或部分遮荫条件下特别有效。",

            'pwm': "PWM（脉宽调制）控制器是经济实惠的太阳能充电控制器，适合较小的系统。它们通过逐渐减少施加到电池的功率来工作，当电池充满电时。虽然比MPPT简单，但它们在许多应用中可靠且高效。",

            'inverter': "我们的混合逆变器将太阳能板和电池的直流电转换为家庭或企业的交流电。它们具有先进的MPPT技术、WiFi监控功能，可与并网和离网系统配合使用。我们提供5kW至15kW的型号，以满足不同的功率需求。",

            'default': "感谢您的提问！作为领先的太阳能设备制造商，Eurovolt专注于：\n\n✓ 混合太阳能逆变器（5kW-15kW）\n✓ MPPT充电控制器\n✓ PWM充电控制器\n\n如需了解具体产品信息，请访问我们的产品页面或联系我们的销售团队。如有技术问题，我们的支持团队随时为您服务！"
        }
    }

    # Get language-specific responses
    responses = fallback_responses.get(language, fallback_responses['en'])

    # Match question to response
    for keyword, response in responses.items():
        if keyword in question_lower and keyword != 'default':
            return response

    # Return default response if no match
    return responses['default']

def get_solar_advice(question: str, language: str = 'en') -> str:
    """
    Get solar-related advice using OpenRouter API or fallback responses
    """
    # If no API client, use fallback
    if not client:
        logging.info(f"Using fallback response for question: {question[:50]}...")
        return get_fallback_response(question, language)

    try:
        # Create language-specific prompts
        if language == 'zh':
            system_prompt = (
                "你是一个太阳能专家，专门为Eurovolt公司提供技术支持。"
                "Eurovolt是一家专业的太阳能设备制造商，生产太阳能逆变器、MPPT和PWM充电控制器。"
                "请用中文回答关于太阳能技术、产品规格、安装建议和故障排除的问题。"
                "保持专业且有帮助的语调。"
            )
        else:
            system_prompt = (
                "You are a solar energy expert providing technical support for Eurovolt company. "
                "Eurovolt is a professional solar equipment manufacturer specializing in solar inverters, "
                "MPPT and PWM charge controllers. Please answer questions about solar technology, "
                "product specifications, installation advice, and troubleshooting. "
                "Keep responses professional and helpful."
            )

        response = client.chat.completions.create(
            model="meta-llama/llama-3.1-8b-instruct:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        return response.choices[0].message.content if response.choices[0].message.content else get_fallback_response(question, language)

    except Exception as e:
        logging.error(f"Error in get_solar_advice: {e}")
        logging.info("Falling back to pre-defined responses")
        return get_fallback_response(question, language)

def analyze_solar_inquiry(message: str) -> dict:
    """
    Analyze solar inquiry to categorize the type of question
    """
    try:
        system_prompt = (
            "Analyze this solar energy inquiry and categorize it. "
            "Return a JSON object with: category (technical, product, installation, pricing, general), "
            "urgency (low, medium, high), and suggested_response_type (detailed, brief, redirect_to_sales)."
        )

        response = client.chat.completions.create(
            model="meta-llama/llama-3.1-8b-instruct:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            temperature=0.3,
            max_tokens=200
        )

        if response.choices[0].message.content:
            import json
            try:
                return json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                return {"category": "general", "urgency": "medium", "suggested_response_type": "detailed"}
        else:
            return {"category": "general", "urgency": "medium", "suggested_response_type": "detailed"}

    except Exception as e:
        logging.error(f"Error in analyze_solar_inquiry: {e}")
        return {"category": "general", "urgency": "medium", "suggested_response_type": "detailed"}