interface Env {
  AI: any;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const { concern, mood, overallStressLevel } = await context.request.json();

    const prompt = `As a financial wellness AI assistant, analyze the following:
    User Concern: ${concern}
    Current Mood: ${mood}
    Overall Stress Level: ${overallStressLevel}/10

    Please provide:
    1. A brief analysis of the situation
    2. 3-5 practical tips to address this concern
    3. 2-3 concrete actions they can take right now

    Consider their current emotional state and stress level in your response.
    Format the response as JSON with the following structure:
    {
      "analysis": "brief situation analysis",
      "tips": ["tip1", "tip2", "tip3"],
      "suggestedActions": ["action1", "action2"]
    }
    `;

    const response = await context.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [{ role: "user", content: prompt }],
    });

    let parsedResponse;
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      console.error("Error parsing AI response:", e);
      // Fallback response if parsing fails
      parsedResponse = {
        analysis:
          "Based on your concern and current mood, this seems to be causing you significant stress.",
        tips: [
          "Take a deep breath and remember this is temporary",
          "Break down the problem into smaller, manageable steps",
          "Consider talking to someone you trust about this",
        ],
        suggestedActions: [
          "Write down your specific concerns",
          "Schedule time to review your finances calmly",
        ],
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
