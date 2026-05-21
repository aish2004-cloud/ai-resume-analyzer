import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import UploadSection from "./components/UploadSection";
import ResultsDashboard from "./components/ResultsDashboard";
import LoadingState from "./components/LoadingState";
import { analyzeResume } from "./utils/api";
import { Cpu, Github, Zap } from "lucide-react";

const FEATURES = [
  { icon: "📄", label: "PDF Parsing" },
  { icon: "🎯", label: "ATS Scoring" },
  { icon: "🔍", label: "Keyword Match" },
  { icon: "🤖", label: "AI Suggestions" },
  { icon: "💼", label: "Job Targeting" },
  { icon: "⚡", label: "Instant Results" },
];

export default function App() {
  const [state, setState] = useState("idle"); // idle | loading | results | error
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  async function handleAnalyze(file, jobRole, jobDescription) {
    setState("loading");
    setProgress(0);
    setError(null);

    try {
      const data = await analyzeResume(file, jobRole, jobDescription, setProgress);
      setResults(data);
      setState("results");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(msg);
      setState("error");
      toast.error(msg, { duration: 5000 });
    }
  }

  function handleReset() {
    setState("idle");
    setResults(null);
    setProgress(0);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-ink-950 relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-electric-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-jade-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-ink-700/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-electric-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-ink-950" />
            </div>
            <div>
              <span className="font-display text-xl text-white tracking-wider">RESUMEAI</span>
              <span className="ml-2 text-xs font-mono text-electric-500 bg-electric-500/10 border border-electric-500/30 px-2 py-0.5 rounded-full">BETA</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-ink-600">
              <Cpu className="w-3.5 h-3.5" />
              Powered by GPT-4o & Gemini
            </div>
            <a
              href="https://github.com"
              className="flex items-center gap-1.5 text-xs text-ink-600 hover:text-white bg-ink-800 hover:bg-ink-700 border border-ink-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {state === "idle" && (
          <div className="space-y-12">
            {/* Hero */}
            <div className="text-center space-y-4 animate-slide-up">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-electric-400 bg-electric-500/10 border border-electric-500/20 px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
                AI-Powered ATS Resume Analyzer
              </div>
              <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wider leading-none">
                BEAT THE{" "}
                <span className="text-electric-400" style={{ textShadow: "0 0 40px #00D4FF55" }}>
                  ATS
                </span>
              </h1>
              <p className="text-ink-600 text-lg max-w-xl mx-auto leading-relaxed">
                Upload your resume. Get an instant ATS score, keyword analysis,
                and AI-powered suggestions to land more interviews.
              </p>

              {/* Features row */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {FEATURES.map((f) => (
                  <span
                    key={f.label}
                    className="flex items-center gap-1.5 text-xs font-mono text-ink-600 bg-ink-800 border border-ink-700 px-3 py-1.5 rounded-full"
                  >
                    {f.icon} {f.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Upload form */}
            <div className="glass-card p-6 sm:p-8">
              <UploadSection onAnalyze={handleAnalyze} loading={false} />
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { step: "01", title: "Upload Resume", desc: "Drop your PDF resume (max 5MB)" },
                { step: "02", title: "Select Target Role", desc: "Choose your target job role for tailored analysis" },
                { step: "03", title: "Get AI Report", desc: "Receive your ATS score + actionable improvements" },
              ].map((item) => (
                <div key={item.step} className="glass-card p-5">
                  <div className="font-display text-4xl text-ink-700 mb-3">{item.step}</div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-ink-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {state === "loading" && (
          <div className="glass-card p-10">
            <LoadingState progress={progress} />
          </div>
        )}

        {state === "error" && (
          <div className="glass-card p-10 text-center space-y-5">
            <div className="text-5xl">⚠️</div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Analysis Failed</h3>
              <p className="text-ink-600 text-sm max-w-md mx-auto">{error}</p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-electric-500 hover:bg-electric-400 text-ink-950 font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {state === "results" && results && (
          <ResultsDashboard data={results} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ink-700/50 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-ink-600">
          <span>© 2024 ResumeAI — Built with MERN + OpenAI + Gemini</span>
          <span>Privacy-first: No resumes stored on our servers</span>
        </div>
      </footer>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161B22",
            color: "#E6EDF3",
            border: "1px solid #30363D",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
          },
        }}
      />
    </div>
  );
}
