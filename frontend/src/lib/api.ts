const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ProjectPlan = Record<string, string | number | boolean | null | undefined> & {
  id?: number;
  idea?: string;
  pdf_path?: string | null;
  has_pdf?: boolean;
  pdf_error?: string;
};

export type ProjectSummary = {
  id: number;
  idea: string;
  created_at: string;
  summary: string;
  has_pdf?: boolean;
  /** Full saved plan — included in list so history works without a second request */
  plan?: ProjectPlan;
};

function apiErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((d) => (typeof d === "object" && d && "msg" in d ? String((d as { msg: unknown }).msg) : String(d)))
        .join("; ");
    }
  }
  return `Server error ${status}`;
}

export async function generatePlan(idea: string): Promise<ProjectPlan> {
  const res = await fetch(`${API}/mentor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(apiErrorMessage(err, res.status));
  }
  return res.json();
}

export async function fetchProjects(): Promise<ProjectSummary[]> {
  const res = await fetch(`${API}/projects`);
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

export async function fetchProject(id: number): Promise<ProjectPlan> {
  const res = await fetch(`${API}/projects/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `Failed to load project (${res.status})`);
  }
  return res.json();
}

export function getPdfDownloadUrl(projectId: number): string {
  return `${API}/projects/${projectId}/pdf`;
}
