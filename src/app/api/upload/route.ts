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


    function extractCGPA(text: string) {
      const match = text.match(/(\d\.\d{1,2})\s*(cgpa|gpa)/i);
      return match ? parseFloat(match[1]) : null;
    }

      function extractSkillsSection(text: string) {
    const lower = text.toLowerCase();

    const start = lower.indexOf("skills");
    const end = lower.indexOf("education");

    if (start === -1) return text;

    return end !== -1
      ? lower.substring(start, end)
      : lower.substring(start);
  }

    function detectProjects(text: string) {
      const keywords = ["project", "intern", "developed", "built"];
      let count = 0;

      keywords.forEach((k) => {
        if (text.toLowerCase().includes(k)) count++;
      });

      return count > 0;
    }

    function resumeCompleteness(text: string) {
      let score = 0;

      if (text.match(/\b\d{10}\b/)) score += 25;
      if (text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)) score += 25;
      if (text.toLowerCase().includes("skills")) score += 25;
      if (text.toLowerCase().includes("education")) score += 25;

      return score;
    }



      function calculateATS(text: string, keywords: string[]) {
          const skillsText = extractSkillsSection(text);

          let score = 0;

          keywords.forEach((k) => {
            if (skillsText.includes(k.toLowerCase())) {
              score++;
            }
          });

          return (score / keywords.length) * 100;
        }

    function extractEmail(text: string) {
      if (!text) return null;

      const patterns = [
        text,
        text.replace(/\s+/g, ""),
        text.replace(/\s+/g, "").replace(/[^a-zA-Z0-9@._-]/g, ""),
      ];

      for (const t of patterns) {
        const match = t.match(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
        );
        if (match) return match[0].toLowerCase();
      }

      return null;
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

    const keywords = ["react", "node", "mongodb", "javascript"];
        const skillScore = calculateATS(text, keywords);

    const cgpa = extractCGPA(text);
    let cgpaScore = 0;
    if (cgpa) {
      if (cgpa >= 7.5) cgpaScore = 100;
      else if (cgpa >= 6) cgpaScore = 60;
      else cgpaScore = 30;
    }

    const projectScore = detectProjects(text) ? 100 : 40;

    const completenessScore = resumeCompleteness(text);

    const finalScore =
      skillScore * 0.5 +
      cgpaScore * 0.2 +
      projectScore * 0.2 +
      completenessScore * 0.1;

    const score = Math.min(finalScore, 100);

    const { data: existing } = await supabase
      .from("candidates")
      .select("*")
      .eq("email", email)
      .single();

    let candidate = existing;

        if (!candidate) {
         const { data: interview } = await supabase
        .from("interview")
        .select("readable_slug, url")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!interview) {
      return NextResponse.json(
        { error: "No active interview found" },
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
            shortlisted: score >= 75,
            interview_link: interviewLink,
            email_sent: false,
          },
        ])
        .select()
        .single();

      candidate = data;
    }

    if (candidate.shortlisted && !candidate.email_sent) {
      try {
          const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Interview Shortlisted",
            html: `
            <div style="font-family: Arial, sans-serif; font-size:14px; color:#000; line-height:1.6;">
              
              <p><strong>Subject:</strong> Application Update: ${email} - Software Engineer Role</p>

              <p>Dear Candidate,</p>

              <p>
                Thank you for your interest in the Software Engineer position and for taking the time to submit your application.
              </p>

              <p>
                We are pleased to inform you that your profile has been <strong>shortlisted</strong> for the next stage of our recruitment process.
              </p>


              <p>
                As part of the next step, you are invited to complete your interview using the link below:
              </p>

              <div style="text-align:center; margin:30px 0;">
                  <a href="${candidate.interview_link}" 
                      style="background:#4f46e5; color:white; padding:12px 24px; text-decoration:none; 
                      border-radius:6px; font-weight:500; display:inline-block;">
                      Start Interview
                  </a>
              </div>

              <p>
                We recommend completing the interview at your earliest convenience. Further instructions will be shared upon successful completion.
              </p>

              <p>
                Thank you for your interest in joining our team. We look forward to your participation in the next stage of the process.
              </p>

              <p>
                Sincerely,<br/>
                <strong>Talent Acquisition Team</strong>
              </p>

              <br/>

              <p style="font-size:12px; color:#555;">
                This is an automated message. Please do not reply to this email.
              </p>

            </div>
            `
          });

          console.log("EMAIL SENT:", info.response);

        } catch (err) {
          console.error("EMAIL ERROR:", err);
        }

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
