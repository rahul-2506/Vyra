import base64
import json
from groq import Groq
from config.settings import settings

def analyze_crop_image(image_bytes: bytes) -> dict:
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
    
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    image_size_kb = len(image_bytes) / 1024
    
    print(f"[Vyra Vision Service] Selected Model: {settings.GROQ_VISION_MODEL}")
    print(f"[Vyra Vision Service] Image Size: {image_size_kb:.2f} KB")
    
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    system_prompt = """You are Vyra, an expert agricultural AI assistant.
Analyze the provided crop image and return highly structured agricultural analysis as valid JSON.

Format your response EXACTLY like this:
{
  "crop": "crop name",
  "disease": "identified disease or deficiency",
  "severity": "severity level (e.g., low, medium, high)",
  "recommendation": "practical solution"
}

Reply ONLY with valid JSON."""

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this crop image and provide a diagnosis."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            model=settings.GROQ_VISION_MODEL,
        )
        content = response.choices[0].message.content
        
        # Manually extract JSON to safely support vision models that might not have json_object mode
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
            
        return json.loads(content.strip())
    except Exception as e:
        print("===== GROQ VISION ERROR =====")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Details: {str(e)}")
        print("=============================")
        return {
            "crop": "Unknown",
            "disease": "Unable to determine",
            "severity": "Unknown",
            "recommendation": "Please consult a local agricultural expert and try again."
        }
