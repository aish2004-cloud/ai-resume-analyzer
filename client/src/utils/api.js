import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function analyzeResume(file, jobRole, jobDescription, onProgress) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobRole", jobRole);
  formData.append("jobDescription", jobDescription || "");

  const response = await axios.post(`${API_BASE}/resume/analyze`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });

  return response.data;
}
