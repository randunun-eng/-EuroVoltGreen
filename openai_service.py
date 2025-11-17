import os
import logging
from openai import OpenAI

# Initialize OpenAI client with OpenRouter
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

def get_solar_advice(question: str, language: str = 'en') -> str:
    """
    Get solar-related advice using OpenRouter API
    """
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

        return response.choices[0].message.content if response.choices[0].message.content else "I apologize, but I couldn't process your question at the moment. Please try again or contact our support team."

    except Exception as e:
        logging.error(f"Error in get_solar_advice: {e}")
        if language == 'zh':
            return "很抱歉，我现在无法处理您的问题。请稍后再试或联系我们的支持团队。"
        else:
            return "I apologize, but I'm experiencing technical difficulties. Please try again later or contact our support team."

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