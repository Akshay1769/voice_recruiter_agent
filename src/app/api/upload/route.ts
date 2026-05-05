import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { Buffer } from "buffer";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { getBaseUrl } from "@/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function calculateATS(text: string, keywords: string[]) {
  let score = 0;
  keywords.forEach((k) => {
    if (text.toLowerCase().includes(k)) score++;
  });
  return (score / keywords.length) * 100;
}

function extractEmail(text: string) {
  const normalized = text.replace(/\s+/g, "");
  const match = normalized.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
  );
  return match ? match[0].toLowerCase() : null;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    try {
      const parsed = await pdf(buffer);
      text = parsed.text || "";
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to parse resume" },
        { status: 500 }
      );
    }

    let email = extractEmail(text);

    if (!email) {
      email = (formData.get("email") as string) || "";
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const keywords = ["react", "node", "mongodb", "javascript", "django"];
    const score = calculateATS(text, keywords);

    const { data: existing } = await supabase
      .from("candidates")
      .select("*")
      .eq("email", email)
      .single();

    let candidate = existing;

    if (!candidate) {

      // create interview (same as your app)
      await fetch(`${getBaseUrl()}/api/create-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewData: {
            name: "AI Screening Interview",
          },
          organizationName: "your-org",
        }),
      });

      // fetch latest interview (same pattern as UI)
      const { data: interview } = await supabase
        .from("interviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!interview) {
        return NextResponse.json(
          { error: "Failed to fetch interview" },
          { status: 500 }
        );
      }

      const base_url = getBaseUrl();

      const interviewLink = interview.readable_slug
        ? `${base_url}/call/${interview.readable_slug}`
        : interview.url?.startsWith("http")
        ? interview.url
        : `https://${interview.url}`;

      const { data } = await supabase
        .from("candidates")
        .insert([
          {
            email,
            ats_score: score,
            shortlisted: score >= 70,
            interview_link: interviewLink,
            email_sent: false,
          },
        ])
        .select()
        .single();

      candidate = data;
    }

    if (candidate.shortlisted && !candidate.email_sent) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Interview Shortlisted",
        html: `
<div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; padding:24px; border-radius:8px;">
    
    <h2 style="color:#4f46e5; margin-bottom:16px;">
      Application Update
    </h2>

    <p>Dear Candidate,</p>

    <p>
      Thank you for your application. We are pleased to inform you that you have been shortlisted for the next stage of our hiring process.
    </p>

    <p>
      <strong>ATS Score:</strong> ${candidate.ats_score.toFixed(2)}%
    </p>

    <p>
      Please proceed with your interview using the link below:
    </p>

    <div style="text-align:center; margin:24px 0;">
      <a href="${candidate.interview_link}" 
         style="background:#4f46e5; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
        Start Interview
      </a>
    </div>

    <p>
      Kindly complete the interview at your earliest convenience.
    </p>

    <br/>

    <p style="margin-top:20px;">
      Best regards,<br/>
      <strong>Recruitment Team</strong>
    </p>

  </div>
</div>
`
      });

      await supabase
        .from("candidates")
        .update({ email_sent: true })
        .eq("email", email);
    }

    return NextResponse.json({
      score: candidate.ats_score,
      shortlisted: candidate.shortlisted,
    });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
