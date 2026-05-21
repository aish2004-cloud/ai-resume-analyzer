const { extractTextFromPDF } = require("../utils/pdfParser");
const { calculateATSScore, getTopMissingKeywords } = require("../utils/atsScorer");
const { getAIAnalysis } = require("../utils/aiAnalyzer");

async function analyzeResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const jobRole = req.body.jobRole || "general";
    const jobDescription = req.body.jobDescription || "";

    // Step 1: Extract text from PDF
    const { text, pages } = await extractTextFromPDF(req.file.buffer);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        error: "Could not extract text from PDF. Please ensure it's a text-based (not scanned) PDF.",
      });
    }

    // Step 2: Calculate ATS score
    const atsResults = calculateATSScore(text, jobRole);
    const topMissingKeywords = getTopMissingKeywords(atsResults);

    // Step 3: Get AI analysis
    const aiAnalysis = await getAIAnalysis(text, jobRole, atsResults);

    // Step 4: Compose response
    const response = {
      success: true,
      metadata: {
        fileName: req.file.originalname,
        pages,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        jobRole,
      },
      atsScore: {
        overall: atsResults.overall,
        technical: atsResults.technical.score,
        actionVerbs: atsResults.action.score,
        softSkills: atsResults.soft.score,
        formatting: atsResults.formatting.score,
        foundKeywords: atsResults.technical.found.slice(0, 15),
        missingKeywords: topMissingKeywords,
        formattingIssues: atsResults.formatting.issues,
      },
      analysis: aiAnalysis,
    };

    res.json(response);
  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json({
      error: error.message || "Failed to analyze resume. Please try again.",
    });
  }
}

module.exports = { analyzeResume };
