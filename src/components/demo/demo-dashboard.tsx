"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Users, ArrowUpRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoInterview, createDemoId, getDemoInterviews, saveDemoInterviews } from "@/lib/demo-store";

export default function DemoDashboard() {
  const [interviews, setInterviews] = useState<DemoInterview[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");

  useEffect(() => {
    setInterviews(getDemoInterviews());
    setLoaded(true);
  }, []);

  const updateInterviews = (next: DemoInterview[]) => {
    setInterviews(next);
    saveDemoInterviews(next);
  };

  const createInterview = () => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const interview: DemoInterview = {
      id: createDemoId(),
      name: cleanName,
      objective: objective.trim() || "Explore the candidate's skills and experience.",
      description: "This is your demo interview. Edit the questions and details to try the workflow.",
      questions: [
        { id: createDemoId(), question: "Tell me about a project you have worked on recently.", follow_up_count: 1 },
        { id: createDemoId(), question: "What was the most challenging part, and how did you solve it?", follow_up_count: 1 },
      ],
      interviewerName: "Alex",
      interviewerImage: "/interviewer-1.png",
      createdAt: new Date().toISOString(),
      isActive: true,
      responses: [],
    };
    updateInterviews([interview, ...interviews]);
    setName("");
    setObjective("");
    setShowCreate(false);
  };

  const deleteInterview = (id: string) => {
    if (!window.confirm("Delete this demo interview from this browser session?")) return;
    updateInterviews(interviews.filter((item) => item.id !== id));
  };

  if (!loaded) return <main className="p-8">Loading demo workspace…</main>;

  return (
    <main className="p-6 md:p-8 pt-4 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Interactive demo</div>
          <h1 className="mt-3 text-2xl font-semibold">Explore Xhire</h1>
          <p className="mt-1 text-sm text-gray-600">Try creating and editing interviews with sample data. Your changes stay in this browser tab.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/sign-in"><Button variant="outline"><LockKeyhole size={16} className="mr-2" /> Sign in to save permanently</Button></Link>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreate((value) => !value)}><Plus size={17} className="mr-2" /> Create interview</Button>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Demo workspace: changes are temporary and are not sent to Xhire's database. Live AI calls, recordings, and email invitations are disabled.
      </div>

      {showCreate && (
        <section className="mt-6 max-w-2xl rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Create a demo interview</h2>
          <label className="mt-4 block text-sm font-medium">Interview name</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Product Designer" />
          <label className="mt-3 block text-sm font-medium">What do you want to evaluate?</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} value={objective} onChange={(event) => setObjective(event.target.value)} placeholder="Skills, experience, and role requirements…" />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" disabled={!name.trim()} onClick={createInterview}>Create demo</Button>
          </div>
        </section>
      )}

      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sample interviews <span className="text-sm font-normal text-gray-500">({interviews.length})</span></h2>
      </div>
      {interviews.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed p-10 text-center text-sm text-gray-500">No demo interviews yet. Create one to try the workflow.</div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {interviews.map((interview) => (
            <article key={interview.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="bg-indigo-700 p-5 text-white">
                <div className="text-xs text-indigo-100">{interview.isActive ? "Active demo" : "Inactive demo"}</div>
                <h3 className="mt-2 text-lg font-semibold">{interview.name}</h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm text-indigo-100">{interview.objective}</p>
              </div>
              <div className="flex items-center justify-between px-5 py-4 text-sm text-gray-600">
                <span>{interview.questions.length} questions</span>
                <span className="inline-flex items-center gap-1"><Users size={15} /> {interview.responses.length} sample responses</span>
              </div>
              <div className="flex items-center justify-between border-t px-4 py-3">
                <Link className="inline-flex items-center text-sm font-semibold text-indigo-700 hover:underline" href={`/demo/interviews/${interview.id}`}>Open workspace <ArrowUpRight size={15} className="ml-1" /></Link>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600" onClick={() => deleteInterview(interview.id)} aria-label={`Delete ${interview.name}`}><Trash2 size={16} /></Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="mt-8 text-xs text-gray-500">Want to use real interviews, AI voice calls, candidate responses, and saved analytics? <Link href="/sign-in" className="font-semibold text-indigo-700 underline">Sign in to your account</Link>.</p>
    </main>
  );
}
