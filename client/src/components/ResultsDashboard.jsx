import { useState } from "react";
import ScoreRing from "./ScoreRing";
import ScoreBar from "./ScoreBar";
import {
  CheckCircle, XCircle, AlertTriangle, Lightbulb, Target,
  ChevronDown, ChevronUp, RotateCcw, Star, Zap, Code2,
  FileCheck, TrendingUp, Award
} from "lucide-react";

const PRIORITY_CONFIG = {
  high: { color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/30", label: "High Priority", icon: AlertTriangle },
  medium: { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30", label: "Medium", icon: Target },
  low: { color: "text-electric-400", bg: "bg-electric-400/10 border-electric-400/30", label: "Low", icon: Lightbulb },
};

function ImprovementCard({ item, index }) {
  const [open, setOpen] = useState(index < 2);
  const config = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.bg} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${config.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono uppercase tracking-wider ${config.color}`}>
              {config.label}
            </span>
          </div>
          <p className="text-white text-sm font-medium mt-0.5 truncate">{item.title}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-ink-600 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-ink-600 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          <p className="text-sm text-ink-600">{item.description}</p>
          {item.suggestion && (
            <div className="bg-ink-900/50 rounded-lg p-3 border-l-2 border-electric-500">
              <p className="text-xs font-mono text-electric-400 mb-1">SUGGESTION</p>
              <p className="text-sm text-white/80">{item.suggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsDashboard({ data, onReset }) {
  const { metadata, atsScore, analysis } = data;

  const getScoreLabel = (s) => {
    if (s >= 80) return "Excellent";
    if (s >= 65) return "Good";
    if (s >= 50) return "Fair";
    return "Needs Work";
  };

  const getScoreColor = (s) => {
    if (s >= 80) return "text-jade-400";
    if (s >= 65) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header bar */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-electric-500/10 border border-electric-500/30 flex items-center justify-center">
            <FileCheck className="w-4 h-4 text-electric-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium truncate max-w-[200px]">{metadata.fileName}</p>
            <p className="text-xs text-ink-600 font-mono">{metadata.pages} page{metadata.pages !== 1 ? "s" : ""} · {metadata.wordCount} words · {metadata.jobRole.replace("-", " ")}</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-ink-600 hover:text-electric-400 bg-ink-700 hover:bg-ink-600 px-3 py-2 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Resume
        </button>
      </div>

      {/* Main scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall ATS score */}
        <div className="glass-card p-6 flex flex-col items-center gap-4 md:col-span-1">
          <div className="text-center">
            <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-3">ATS Score</p>
            <ScoreRing score={atsScore.overall} size={160} strokeWidth={12} />
            <p className={`font-display text-2xl mt-3 ${getScoreColor(atsScore.overall)}`}>
              {getScoreLabel(atsScore.overall)}
            </p>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="glass-card p-6 space-y-4 md:col-span-2">
          <p className="text-xs font-mono text-ink-600 uppercase tracking-widest">Score Breakdown</p>
          <div className="space-y-4">
            <ScoreBar label="Technical Keywords" score={atsScore.technical} icon="⚡" />
            <ScoreBar label="Action Verbs" score={atsScore.actionVerbs} icon="🎯" />
            <ScoreBar label="Soft Skills" score={atsScore.softSkills} icon="🤝" />
            <ScoreBar label="Formatting & Structure" score={atsScore.formatting} icon="📋" />
          </div>
        </div>
      </div>

      {/* Top recommendation */}
      {analysis.topRecommendation && (
        <div className="glass-card p-5 border-l-4 border-electric-500 bg-electric-500/5">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-electric-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-mono text-electric-400 uppercase tracking-widest mb-1">Top Recommendation</p>
              <p className="text-white text-sm">{analysis.topRecommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {analysis.summary && (
        <div className="glass-card p-5">
          <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-3">AI Summary</p>
          <p className="text-white/80 text-sm leading-relaxed">{analysis.summary}</p>
        </div>
      )}

      {/* Keywords section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Found keywords */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-jade-400" />
            <p className="text-xs font-mono text-ink-600 uppercase tracking-widest">Keywords Found</p>
            <span className="ml-auto text-xs font-mono text-jade-400">{atsScore.foundKeywords.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {atsScore.foundKeywords.map((kw) => (
              <span key={kw} className="tag-found">{kw}</span>
            ))}
          </div>
        </div>

        {/* Missing keywords */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-4 h-4 text-rose-400" />
            <p className="text-xs font-mono text-ink-600 uppercase tracking-widest">Keywords Missing</p>
            <span className="ml-auto text-xs font-mono text-rose-400">{atsScore.missingKeywords.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {atsScore.missingKeywords.map((kw) => (
              <span key={kw} className="tag-missing">{kw}</span>
            ))}
          </div>
          {atsScore.formattingIssues.length > 0 && (
            <div className="mt-4 pt-4 border-t border-ink-600/40">
              <p className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">Formatting Issues</p>
              {atsScore.formattingIssues.map((issue) => (
                <p key={issue} className="text-xs text-ink-600 flex items-center gap-1.5 mt-1">
                  <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                  {issue}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Strengths */}
      {analysis.strengths?.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-jade-400" />
            <p className="text-xs font-mono text-ink-600 uppercase tracking-widest">Strengths</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-jade-400/5 border border-jade-400/20">
                <CheckCircle className="w-4 h-4 text-jade-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">{s.title}</p>
                  <p className="text-xs text-ink-600 mt-0.5 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {analysis.improvements?.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <p className="text-xs font-mono text-ink-600 uppercase tracking-widest">Improvements</p>
            <span className="ml-auto text-xs font-mono text-amber-400">{analysis.improvements.length} actions</span>
          </div>
          <div className="space-y-3">
            {analysis.improvements.map((item, i) => (
              <ImprovementCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* AI-suggested bullet points */}
      {analysis.suggestedBullets?.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-electric-400" />
            <p className="text-xs font-mono text-ink-600 uppercase tracking-widest">AI-Suggested Bullet Points</p>
          </div>
          <div className="space-y-3">
            {analysis.suggestedBullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-ink-700/60 border border-ink-600/40 group hover:border-electric-500/30 transition-colors">
                <Zap className="w-3.5 h-3.5 text-electric-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 font-mono leading-relaxed group-hover:text-white transition-colors">{bullet}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-600 mt-3">✦ Adapt these examples to your actual experience and achievements</p>
        </div>
      )}
    </div>
  );
}
