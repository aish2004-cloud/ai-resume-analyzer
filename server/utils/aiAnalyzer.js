const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function analyzeWithOpenAI(resumeText, jobRole, atsResults) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = buildPrompt(resumeText, jobRole, atsResults);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert ATS (Applicant Tracking System) resume coach and career advisor. Analyze resumes thoroughly and provide actionable, specific feedback. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

async function analyzeWithGemini(resumeText, jobRole, atsResults) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = buildPrompt(resumeText, jobRole, atsResults);

  const result = await model.generateContent(
    `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, just raw JSON.`
  );

  const text = result.response.text();
  // Strip any markdown fences if present
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

function buildPrompt(resumeText, jobRole, atsResults) {
  return `Analyze this resume for a ${jobRole.replace("-", " ")} position.

ATS KEYWORD ANALYSIS:
- Technical keywords found: ${atsResults.technical.found.slice(0, 10).join(", ")}
- Technical keywords missing: ${atsResults.technical.missing.slice(0, 10).join(", ")}
- Action verbs found: ${atsResults.action.found.join(", ")}
- ATS Score: ${atsResults.overall}/100

RESUME TEXT:
${resumeText.slice(0, 3000)}

Provide a comprehensive analysis in this EXACT JSON format:
{
  "summary": "2-3 sentence overall assessment of this resume",
  "strengths": [
    {"title": "Strength title", "description": "Detailed explanation"}
  ],
  "improvements": [
    {
      "priority": "high|medium|low",
      "title": "Issue title",
      "description": "What the problem is",
      "suggestion": "Exactly how to fix it with an example if possible"
    }
  ],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestedBullets": [
    "Example bullet point using STAR method showing impact with metrics"
  ],
  "sectionScores": {
    "contact": 85,
    "summary": 70,
    "experience": 75,
    "education": 80,
    "skills": 65
  },
  "jobFitScore": 72,
  "topRecommendation": "The single most important thing to fix right now"
}

Provide 3-5 strengths, 4-6 improvements (mix of priorities), 5-8 missing keywords, and 3 example bullet points.`;
}

async function getAIAnalysis(resumeText, jobRole, atsResults) {
  // Try OpenAI first, fallback to Gemini
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_key_here") {
    try {
      return await analyzeWithOpenAI(resumeText, jobRole, atsResults);
    } catch (err) {
      console.warn("OpenAI failed, trying Gemini:", err.message);
    }
  }

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_key_here") {
    try {
      return await analyzeWithGemini(resumeText, jobRole, atsResults);
    } catch (err) {
      console.warn("Gemini also failed:", err.message);
    }
  }

  // Fallback mock response for demo
  return getMockAnalysis(jobRole, atsResults);
}

function getMockAnalysis(jobRole, atsResults) {
  return {
    summary: `Your resume shows ${atsResults.overall > 70 ? "solid" : "some"} alignment for a ${jobRole.replace("-", " ")} role. With targeted improvements to keyword optimization and quantified achievements, you can significantly boost your ATS pass-through rate.`,
    strengths: [
      { title: "Relevant Technical Skills", description: `You've included ${atsResults.technical.found.length} relevant technical keywords that ATS systems look for.` },
      { title: "Action-Oriented Language", description: `Good use of ${atsResults.action.found.length} strong action verbs that demonstrate initiative.` },
      { title: "Structured Format", description: "Your resume follows a logical structure that is easy for ATS to parse." },
    ],
    improvements: [
      { priority: "high", title: "Add Quantified Achievements", description: "Bullets lack specific metrics and numbers.", suggestion: 'Change "Improved app performance" to "Improved app load time by 40%, reducing bounce rate by 22%"' },
      { priority: "high", title: "Missing Critical Keywords", description: `${atsResults.technical.missing.slice(0, 3).join(", ")} are missing from your resume.`, suggestion: "Integrate these keywords naturally into your experience bullets and skills section." },
      { priority: "medium", title: "Strengthen Professional Summary", description: "Your summary doesn't immediately communicate your value proposition.", suggestion: "Lead with years of experience, key specialization, and one major achievement." },
      { priority: "low", title: "LinkedIn Profile URL", description: "A LinkedIn URL increases credibility and recruiter engagement.", suggestion: "Add a customized LinkedIn URL: linkedin.com/in/yourname" },
    ],
    missingKeywords: atsResults.technical.missing.slice(0, 6),
    suggestedBullets: [
      "Architected and deployed a microservices-based API system handling 50K+ daily requests with 99.9% uptime",
      "Led a cross-functional team of 4 engineers to deliver a critical feature 2 weeks ahead of schedule, increasing user retention by 18%",
      "Optimized database queries reducing page load time by 60% and cutting AWS infrastructure costs by $2,400/month",
    ],
    sectionScores: { contact: 80, summary: 65, experience: 70, education: 85, skills: atsResults.technical.score },
    jobFitScore: atsResults.overall,
    topRecommendation: `Add ${atsResults.technical.missing.slice(0, 3).join(", ")} to your skills section — these are the most searched keywords for ${jobRole.replace("-", " ")} roles.`,
  };
}

module.exports = { getAIAnalysis };
