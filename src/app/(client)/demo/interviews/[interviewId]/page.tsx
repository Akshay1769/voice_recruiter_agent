"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoInterview, getDemoInterviews, saveDemoInterviews } from "@/lib/demo-store";

export default function DemoInterviewPage({ params }: { params: { interviewId: string } }) {
  const router = useRouter();
  const [interview, setInterview] = useState<DemoInterview | null>(null);
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    const found = getDemoInterviews().find((item) => item.id === params.interviewId);
    if (found) {
      setInterview(found);
      setName(found.name);
      setObjective(found.objective);
      setDescription(found.description);
      setQuestions(found.questions.map((item) => item.question));
    }
  }, [params.interviewId]);

  const saveChanges = () => {
    if (!interview) return;
    const updated: DemoInterview = {
      ...interview,
      name: name.trim(),
      objective: objective.trim(),
      description: description.trim(),
      questions: questions.filter((question) => question.trim()).map((question, index) => ({
        id: interview.questions[index]?.id || `question-${Date.now()}-${index}`,
        question: question.trim(),
        follow_up_count: interview.questions[index]?.follow_up_count || 1,
      })),
    };
    const all = getDemoInterviews().map((item) => item.id === updated.id ? updated : item);
    saveDemoInterviews(all);
    setInterview(updated);
  };

  const addQuestion = () => setQuestions((current) => [...current, ""]);
  const updateQuestion = (index: number, value: string) => setQuestions((current) => current.map((item, i) => i === index ? value : item));

  if (!interview) {
    return <main className="p-8"><p className="text-gray-600">This demo interview could not be found in this browser session.</p><Link className="mt-3 inline-block text-indigo-700 underline" href="/dashboard">Back to demo workspace</Link></main>;
  }

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-indigo-700 hover:underline"><ArrowLeft size={16} className="mr-2" /> Back to interviews</Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div><div className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Demo interview workspace</div><h1 className="mt-1 text-2xl font-semibold">{interview.name}</h1><p className="mt-1 text-sm text-gray-500">Changes are stored only in this browser tab.</p></div>
        <Link href="/sign-in"><Button variant="outline"><LockKeyhole size={16} className="mr-2" /> Sign in to save permanently</Button></Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Interview setup</h2>
          <label className="mt-4 block text-sm font-medium">Interview name</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={name} onChange={(event) => setName(event.target.value)} />
          <label className="mt-3 block text-sm font-medium">Objective</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} value={objective} onChange={(event) => setObjective(event.target.value)} />
          <label className="mt-3 block text-sm font-medium">Candidate-facing description</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
          <div className="mt-5 flex items-center justify-between"><h3 className="font-semibold">Questions ({questions.length})</h3><Button variant="outline" size="sm" onClick={addQuestion}><Plus size={15} className="mr-1" /> Add question</Button></div>
          <div className="mt-3 space-y-3">
            {questions.map((question, index) => <div key={index} className="flex gap-2"><span className="pt-2 text-sm text-gray-500">{index + 1}.</span><textarea className="w-full rounded-md border px-3 py-2 text-sm" rows={2} value={question} onChange={(event) => updateQuestion(index, event.target.value)} /></div>)}
          </div>
          <Button className="mt-5 bg-indigo-600 hover:bg-indigo-700" onClick={saveChanges}><Save size={16} className="mr-2" /> Save demo changes</Button>
        </section>

        <section className="space-y-5">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Sample candidate responses</h2>
            <p className="mt-1 text-xs text-gray-500">Preloaded examples — not real candidate data.</p>
            {interview.responses.length ? <div className="mt-4 space-y-3">{interview.responses.map((response) => <div key={response.id} className="rounded-lg bg-gray-50 p-3"><div className="flex items-center justify-between gap-2"><div className="font-medium text-sm">{response.name}</div><div className="rounded-full border bg-white px-2 py-1 text-xs font-semibold text-indigo-700">{response.overallScore}/100</div></div><p className="mt-1 text-xs text-gray-500">{response.role}</p><p className="mt-2 text-sm text-gray-700">{response.summary}</p></div>)}</div> : <p className="mt-4 text-sm text-gray-500">No sample responses for this new demo interview yet.</p>}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Live calls are disabled in demo mode.</strong><p className="mt-1">This workspace uses sample data only. It will not start Retell calls, record audio, send emails, or write candidate information to the database.</p></div>
        </section>
      </div>
    </main>
  );
}
