export interface DemoQuestion {
  id: string;
  question: string;
  follow_up_count: number;
}

export interface DemoResponse {
  id: string;
  name: string;
  role: string;
  overallScore: number;
  summary: string;
  createdAt: string;
}

export interface DemoInterview {
  id: string;
  name: string;
  objective: string;
  description: string;
  questions: DemoQuestion[];
  interviewerName: string;
  interviewerImage: string;
  createdAt: string;
  isActive: boolean;
  responses: DemoResponse[];
}

const STORAGE_KEY = "xhire-demo-interviews-v1";

const seedInterviews: DemoInterview[] = [
  {
    id: "demo-frontend-engineer",
    name: "Frontend Engineer",
    objective: "Evaluate React, JavaScript, accessibility, and problem-solving skills.",
    description: "A sample technical interview for a frontend engineering role.",
    questions: [
      { id: "fe-q1", question: "How does React's reconciliation process work?", follow_up_count: 2 },
      { id: "fe-q2", question: "How would you improve the performance of a slow React application?", follow_up_count: 2 },
      { id: "fe-q3", question: "Explain the difference between controlled and uncontrolled components.", follow_up_count: 1 },
    ],
    interviewerName: "Alex",
    interviewerImage: "/interviewer-1.png",
    createdAt: "2026-11-01T10:00:00.000Z",
    isActive: true,
    responses: [
      { id: "fe-r1", name: "Jordan Lee", role: "Frontend Developer", overallScore: 86, summary: "Strong React fundamentals and clear explanations. Could go deeper on profiling tools.", createdAt: "2026-11-02T09:30:00.000Z" },
      { id: "fe-r2", name: "Taylor Morgan", role: "Software Engineer", overallScore: 74, summary: "Good JavaScript knowledge with room to improve accessibility and performance trade-offs.", createdAt: "2026-11-03T11:15:00.000Z" },
    ],
  },
  {
    id: "demo-backend-engineer",
    name: "Backend Engineer",
    objective: "Assess API design, databases, scalability, and debugging approach.",
    description: "A sample interview focused on backend engineering fundamentals.",
    questions: [
      { id: "be-q1", question: "How would you design a rate limiter for a REST API?", follow_up_count: 2 },
      { id: "be-q2", question: "When would you choose an index in a relational database?", follow_up_count: 1 },
      { id: "be-q3", question: "How do you investigate a slow production endpoint?", follow_up_count: 2 },
    ],
    interviewerName: "Alex",
    interviewerImage: "/interviewer-1.png",
    createdAt: "2026-11-04T10:00:00.000Z",
    isActive: true,
    responses: [
      { id: "be-r1", name: "Casey Patel", role: "Backend Developer", overallScore: 91, summary: "Excellent API and database reasoning with practical examples.", createdAt: "2026-11-05T08:45:00.000Z" },
    ],
  },
];

export function getDemoInterviews(): DemoInterview[] {
  if (typeof window === "undefined") return seedInterviews;
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(seedInterviews));
      return seedInterviews;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : seedInterviews;
  } catch {
    return seedInterviews;
  }
}

export function saveDemoInterviews(interviews: DemoInterview[]): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
}

export function createDemoId(): string {
  return `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
