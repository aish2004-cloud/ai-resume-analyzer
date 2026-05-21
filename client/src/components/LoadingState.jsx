import { useEffect, useState } from "react";

const STEPS = [
  { label: "Uploading PDF", detail: "Transferring your resume securely..." },
  { label: "Parsing Resume", detail: "Extracting text and structure..." },
  { label: "ATS Keyword Scan", detail: "Matching industry-specific keywords..." },
  { label: "AI Analysis", detail: "Generating personalized improvements..." },
  { label: "Building Report", detail: "Compiling your results..." },
];

export default function LoadingState({ progress }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 2200);

    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(dotInterval);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto text-center space-y-8 py-8">
      {/* Animated logo */}
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-electric-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-electric-500/40 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-ink-800 border border-ink-600 flex items-center justify-center">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <rect x="6" y="4" width="14" height="18" rx="2" stroke="#00D4FF" strokeWidth="1.5" />
              <path d="M10 9h6M10 12h6M10 15h4" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="22" cy="22" r="5" fill="#080C10" stroke="#3DDC84" strokeWidth="1.5" />
              <path d="M20 22l1.5 1.5L24 20" stroke="#3DDC84" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-2xl text-white tracking-wider">
          ANALYZING{dots}
        </h3>
        <p className="text-sm text-ink-600">
          {STEPS[currentStep].detail}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-2 text-left">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
              i === currentStep
                ? "bg-electric-500/10 border border-electric-500/30"
                : i < currentStep
                ? "opacity-50"
                : "opacity-20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                i < currentStep
                  ? "bg-jade-400 border-jade-400"
                  : i === currentStep
                  ? "border-electric-500 animate-pulse"
                  : "border-ink-600"
              }`}
            >
              {i < currentStep && (
                <svg className="w-3 h-3 text-ink-950" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {i === currentStep && (
                <div className="w-2 h-2 rounded-full bg-electric-500" />
              )}
            </div>
            <span className={`text-sm ${i === currentStep ? "text-white font-medium" : "text-ink-600"}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="space-y-1.5">
          <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-electric-600 to-electric-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-mono text-ink-600">{progress}% uploaded</p>
        </div>
      )}
    </div>
  );
}
