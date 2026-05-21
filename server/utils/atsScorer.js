// ATS keyword database by job role
const JOB_ROLE_KEYWORDS = {
  "software-engineer": {
    technical: [
      "javascript", "python", "java", "react", "node.js", "sql", "git",
      "api", "rest", "microservices", "docker", "kubernetes", "aws", "ci/cd",
      "agile", "scrum", "typescript", "html", "css", "mongodb", "postgresql",
      "redis", "graphql", "testing", "unit test", "debugging", "algorithms",
      "data structures", "system design", "oop", "solid principles"
    ],
    action: [
      "developed", "implemented", "designed", "built", "optimized",
      "deployed", "architected", "led", "collaborated", "maintained",
      "reduced", "improved", "increased", "automated", "refactored"
    ],
    soft: ["problem-solving", "communication", "teamwork", "leadership", "mentoring"]
  },
  "data-scientist": {
    technical: [
      "python", "r", "machine learning", "deep learning", "tensorflow",
      "pytorch", "scikit-learn", "pandas", "numpy", "sql", "tableau",
      "power bi", "statistics", "nlp", "computer vision", "data analysis",
      "feature engineering", "model training", "regression", "classification",
      "clustering", "a/b testing", "spark", "hadoop", "jupyter", "matplotlib",
      "seaborn", "neural networks", "llm", "transformers", "data pipeline"
    ],
    action: [
      "analyzed", "built", "modeled", "predicted", "visualized", "extracted",
      "processed", "trained", "evaluated", "deployed", "improved", "discovered"
    ],
    soft: ["analytical", "research", "curiosity", "communication", "presentation"]
  },
  "product-manager": {
    technical: [
      "roadmap", "kpi", "okr", "agile", "scrum", "jira", "confluence",
      "user research", "a/b testing", "analytics", "sql", "figma",
      "stakeholder management", "go-to-market", "mvp", "backlog",
      "sprint planning", "user stories", "product strategy", "data-driven",
      "metrics", "growth", "product lifecycle", "market research"
    ],
    action: [
      "launched", "led", "defined", "prioritized", "aligned", "drove",
      "increased", "improved", "collaborated", "managed", "delivered", "scaled"
    ],
    soft: ["leadership", "communication", "empathy", "strategic", "influence"]
  },
  "frontend-developer": {
    technical: [
      "react", "vue", "angular", "javascript", "typescript", "html5",
      "css3", "sass", "tailwind", "webpack", "vite", "next.js", "nuxt",
      "responsive design", "accessibility", "wcag", "performance",
      "seo", "pwa", "graphql", "rest api", "testing", "jest", "cypress",
      "git", "figma", "ui/ux", "animation", "web components"
    ],
    action: [
      "developed", "built", "designed", "implemented", "optimized",
      "improved", "maintained", "created", "collaborated", "delivered"
    ],
    soft: ["attention to detail", "creativity", "collaboration", "problem-solving"]
  },
  "devops-engineer": {
    technical: [
      "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "jenkins",
      "github actions", "terraform", "ansible", "linux", "bash", "python",
      "monitoring", "grafana", "prometheus", "elk stack", "nginx",
      "load balancing", "security", "networking", "vpc", "iam",
      "infrastructure as code", "helm", "gitlab", "devops", "sre"
    ],
    action: [
      "automated", "deployed", "configured", "managed", "optimized",
      "reduced", "improved", "implemented", "maintained", "monitored"
    ],
    soft: ["problem-solving", "reliability", "collaboration", "documentation"]
  },
  "general": {
    technical: [
      "microsoft office", "excel", "project management", "communication",
      "leadership", "teamwork", "problem solving", "analysis", "reporting"
    ],
    action: [
      "managed", "led", "developed", "improved", "created", "organized",
      "coordinated", "delivered", "achieved", "implemented"
    ],
    soft: ["communication", "adaptability", "critical thinking", "time management"]
  }
};

function calculateATSScore(resumeText, jobRole = "general") {
  const text = resumeText.toLowerCase();
  const keywords = JOB_ROLE_KEYWORDS[jobRole] || JOB_ROLE_KEYWORDS["general"];

  const results = {
    technical: { found: [], missing: [], score: 0 },
    action: { found: [], missing: [], score: 0 },
    soft: { found: [], missing: [], score: 0 },
    formatting: { issues: [], score: 0 },
    overall: 0,
  };

  // Check technical keywords
  keywords.technical.forEach((kw) => {
    if (text.includes(kw.toLowerCase())) {
      results.technical.found.push(kw);
    } else {
      results.technical.missing.push(kw);
    }
  });
  results.technical.score = Math.round(
    (results.technical.found.length / keywords.technical.length) * 100
  );

  // Check action verbs
  keywords.action.forEach((kw) => {
    if (text.includes(kw.toLowerCase())) {
      results.action.found.push(kw);
    } else {
      results.action.missing.push(kw);
    }
  });
  results.action.score = Math.round(
    (results.action.found.length / keywords.action.length) * 100
  );

  // Check soft skills
  keywords.soft.forEach((kw) => {
    if (text.includes(kw.toLowerCase())) {
      results.soft.found.push(kw);
    } else {
      results.soft.missing.push(kw);
    }
  });
  results.soft.score = Math.round(
    (results.soft.found.length / keywords.soft.length) * 100
  );

  // Formatting checks
  const formattingChecks = [
    { check: text.includes("experience"), issue: "Missing 'Experience' section" },
    { check: text.includes("education"), issue: "Missing 'Education' section" },
    { check: text.includes("skills"), issue: "Missing 'Skills' section" },
    { check: text.length > 300, issue: "Resume appears too short" },
    { check: text.length < 5000, issue: "Resume may be too long (>2 pages)" },
    { check: /\d{4}/.test(text), issue: "Missing dates for positions" },
    { check: /@/.test(text), issue: "Missing email address" },
    { check: /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text) || text.includes("linkedin") || text.includes("github"), issue: "Missing contact details (phone/LinkedIn/GitHub)" },
  ];

  let formattingPass = 0;
  formattingChecks.forEach(({ check, issue }) => {
    if (!check) {
      results.formatting.issues.push(issue);
    } else {
      formattingPass++;
    }
  });
  results.formatting.score = Math.round((formattingPass / formattingChecks.length) * 100);

  // Overall ATS score (weighted)
  results.overall = Math.round(
    results.technical.score * 0.4 +
    results.action.score * 0.2 +
    results.soft.score * 0.15 +
    results.formatting.score * 0.25
  );

  return results;
}

function getTopMissingKeywords(atsResults, limit = 10) {
  return [
    ...atsResults.technical.missing.slice(0, 6),
    ...atsResults.action.missing.slice(0, 2),
    ...atsResults.soft.missing.slice(0, 2),
  ].slice(0, limit);
}

module.exports = { calculateATSScore, getTopMissingKeywords, JOB_ROLE_KEYWORDS };
