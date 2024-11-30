export default {
    async fetch(request, env) {
      // Handle CORS
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }
  
      try {
        const { concern } = await request.json();
  
        // Create a structured prompt for the AI
        const prompt = `As a financial advisor, analyze this concern: "${concern}"

Please provide:
1. Three specific, actionable tips to address this concern
2. A stress level rating from 1-10 based on the severity of the concern

Format your response as follows:
{
  "tips": ["tip1", "tip2", "tip3"],
  "stressLevel": number
}`;
  
        // Call the Llama-2 model
        const aiResponse = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
          messages: [
            {
              role: "system",
              content: "You are a knowledgeable financial advisor. Provide concise, practical advice and assess stress levels accurately."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        });
  
        // Parse the AI response
        let parsedResponse;
        try {
          // Try to parse the AI's response as JSON
          parsedResponse = JSON.parse(aiResponse.response);
        } catch (e) {
          // If parsing fails, extract information from the text response
          const text = aiResponse.response;
          const tips = text.match(/(?:"[^"]*"|[^,])+/g)
            ?.filter(tip => tip.trim().length > 0)
            ?.slice(0, 3)
            ?.map(tip => tip.trim().replace(/^["'\s]+|["'\s]+$/g, '')) || [];
          
          const stressLevelMatch = text.match(/\b([1-9]|10)\b/);
          const stressLevel = stressLevelMatch ? parseInt(stressLevelMatch[0]) : 5;
  
          parsedResponse = {
            tips: tips.length > 0 ? tips : [
              "Break down the problem into smaller, manageable steps",
              "Create a detailed budget to understand your finances",
              "Consider consulting with a financial advisor"
            ],
            stressLevel: stressLevel
          };
        }
  
        return new Response(JSON.stringify({
          result: parsedResponse
        }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
  
      } catch (error) {
        console.error('Worker error:', error);
        return new Response(JSON.stringify({
          error: error.message,
          result: {
            tips: [
              "Take deep breaths and assess your situation calmly",
              "Consider creating a detailed budget",
              "Consult with a financial advisor for guidance"
            ],
            stressLevel: 5
          }
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    },
  };