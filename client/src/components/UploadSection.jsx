import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X, Zap, ChevronDown } from "lucide-react";

const JOB_ROLES = [
  { value: "software-engineer", label: "Software Engineer" },
  { value: "frontend-developer", label: "Frontend Developer" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
  { value: "devops-engineer", label: "DevOps Engineer" },
  { value: "general", label: "General / Other" },
];

export default function UploadSection({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("software-engineer");
  const [jobDescription, setJobDescription] = useState("");
  const [showJD, setShowJD] = useState(false);

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: loading,
  });

  const handleSubmit = () => {
    if (!file) return;
    onAnalyze(file, jobRole, jobDescription);
  };

  const formatSize = (bytes) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)}KB` : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragReject
            ? "border-rose-500 bg-rose-500/5"
            : isDragActive
            ? "border-electric-500 bg-electric-500/10 scale-[1.01]"
            : file
            ? "border-jade-400 bg-jade-400/5"
            : "border-ink-600 hover:border-electric-500/60 hover:bg-electric-500/5 bg-ink-800/40"
        }`}
      >
        <input {...getInputProps()} />

        {/* Scan line animation on drag */}
        {isDragActive && <div className="scan-line" />}

        {file ? (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-jade-400/10 rounded-2xl flex items-center justify-center border border-jade-400/30">
              <FileText className="w-8 h-8 text-jade-400" />
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{file.name}</p>
              <p className="text-ink-600 text-sm font-mono mt-1">{formatSize(file.size)}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-400/10 hover:bg-rose-400/20 px-3 py-1.5 rounded-full transition-colors"
            >
              <X className="w-3 h-3" /> Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-ink-700 border border-ink-600 flex items-center justify-center group-hover:border-electric-500/50 transition-colors">
              <Upload className={`w-7 h-7 transition-colors ${isDragActive ? "text-electric-400" : "text-ink-600"}`} />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                {isDragActive ? "Drop it like it's hot 🔥" : "Drop your resume here"}
              </p>
              <p className="text-ink-600 text-sm mt-1">
                or <span className="text-electric-400 underline underline-offset-2">browse files</span> · PDF only · Max 5MB
              </p>
            </div>
            {isDragReject && (
              <p className="text-rose-400 text-sm font-medium">Only PDF files are accepted</p>
            )}
          </div>
        )}
      </div>

      {/* Job role selector */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-mono text-ink-600 uppercase tracking-widest">Target Role</label>
          <div className="relative">
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full appearance-none bg-ink-800 border border-ink-600 text-white rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-electric-500 transition-colors cursor-pointer"
            >
              {JOB_ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-ink-600 uppercase tracking-widest">
            Job Description{" "}
            <span className="text-electric-500/60 normal-case">(optional)</span>
          </label>
          <button
            onClick={() => setShowJD(!showJD)}
            className="w-full bg-ink-800 border border-ink-600 text-sm text-ink-600 hover:text-electric-400 hover:border-electric-500/50 rounded-xl px-4 py-3 text-left transition-colors"
          >
            {showJD ? "Hide JD input ↑" : "Paste job description ↓"}
          </button>
        </div>
      </div>

      {showJD && (
        <div className="space-y-2 animate-fade-in">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for more targeted keyword analysis..."
            rows={4}
            className="w-full bg-ink-800 border border-ink-600 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-electric-500 transition-colors resize-none placeholder:text-ink-600"
          />
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2.5 transition-all duration-300 ${
          !file || loading
            ? "bg-ink-700 text-ink-600 cursor-not-allowed"
            : "bg-electric-500 hover:bg-electric-400 text-ink-950 shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 active:scale-[0.98]"
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Analyze Resume
          </>
        )}
      </button>
    </div>
  );
}
