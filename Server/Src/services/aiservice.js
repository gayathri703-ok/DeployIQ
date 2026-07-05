import OpenAI from "openai";

// ============================================
// Safe OpenAI Initialization
// ============================================

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// ============================================
// Analyze Deployment Error
// ============================================

const analyzeDeploymentError = async (
  errorMessage,
  logs = ""
) => {

  // AI disabled fallback
  if (!openai) {

    return {
      error: errorMessage,
      explanation:
        "OpenAI API key not configured.",
      fix:
        "Add OPENAI_API_KEY in .env file.",
      severity: "low",
    };

  }

  try {

    const prompt = `
You are an expert DevOps engineer.

Error:
${errorMessage}

Logs:
${logs}

Respond ONLY in JSON:
{
  "error": "",
  "explanation": "",
  "fix": "",
  "severity": "low|medium|high"
}
`;

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.3,

      });

    return JSON.parse(
      response.choices[0].message.content
    );

  } catch (error) {

    console.error(
      "AI analysis failed:",
      error.message
    );

    return {
      error: errorMessage,
      explanation:
        "AI analysis failed.",
      fix:
        "Check deployment logs manually.",
      severity: "medium",
    };

  }

};

// ============================================
// Optimization Suggestions
// ============================================

const getOptimizationSuggestions =
  async (projectInfo) => {

    if (!openai) {

      return {
        suggestions: [],
      };

    }

    try {

      const prompt = `
Project Framework:
${projectInfo.framework}

Build Time:
${projectInfo.buildTime}

Give 3 optimization suggestions in JSON.
`;

      const response =
        await openai.chat.completions.create({

          model: "gpt-4o-mini",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

        });

      return JSON.parse(
        response.choices[0].message.content
      );

    } catch {

      return {
        suggestions: [],
      };

    }

  };

// ============================================
// Export
// ============================================

export {
  analyzeDeploymentError,
  getOptimizationSuggestions
};