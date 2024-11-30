interface FinancialInsight {
  tips: string[];
  analysis: string;
  suggestedActions: string[];
}

export async function getFinancialInsights(
  concern: string,
  mood: string,
  overallStressLevel: number,
): Promise<FinancialInsight> {
  try {
    const response = await fetch("/api/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        concern,
        mood,
        overallStressLevel,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get insights");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting insights:", error);
    return {
      tips: ["Take deep breaths", "Break down the problem into smaller steps"],
      analysis: "Unable to analyze at the moment. Please try again later.",
      suggestedActions: ["Consider talking to a financial advisor"],
    };
  }
}
