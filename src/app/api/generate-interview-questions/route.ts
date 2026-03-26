// import { OpenAI } from "openai";
// import { NextResponse } from "next/server";
// import {
//   SYSTEM_PROMPT,
//   generateQuestionsPrompt,
// } from "@/lib/prompts/generate-questions";
// import { logger } from "@/lib/logger";

// export const maxDuration = 60;

// export async function POST(req: Request, res: Response) {
//   logger.info("generate-interview-questions request received");
//   const body = await req.json();

//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     maxRetries: 5,
//     dangerouslyAllowBrowser: true,
//   });

//   try {
//     const baseCompletion = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: SYSTEM_PROMPT,
//         },
//         {
//           role: "user",
//           content: generateQuestionsPrompt(body),
//         },
//       ],
//       response_format: { type: "json_object" },
//     });

//     const basePromptOutput = baseCompletion.choices[0] || {};
//     const content = basePromptOutput.message?.content;

//     logger.info("Interview questions generated successfully");

//     return NextResponse.json(
//       {
//         response: content,
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     logger.error("Error generating interview questions");

//     return NextResponse.json(
//       { error: "internal server error" },
//       { status: 500 },
//     );
//   }
// }



// import { OpenAI } from "openai";
// import { NextResponse } from "next/server";
// import {
//   SYSTEM_PROMPT,
//   generateQuestionsPrompt,
// } from "@/lib/prompts/generate-questions";
// import { logger } from "@/lib/logger";

// export const maxDuration = 60;

// export async function POST(req: Request) {
//   logger.info("generate-interview-questions request received");

//   const body = await req.json();

//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     maxRetries: 5,
//     dangerouslyAllowBrowser: true,
//   });

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o",
//       response_format: { type: "json_object" },
//       messages: [
//         { role: "system", content: SYSTEM_PROMPT },
//         { role: "user", content: generateQuestionsPrompt(body) },
//       ],
//     });

//     const content = completion.choices[0]?.message?.content;

//     logger.info("Interview questions generated successfully");

//     return NextResponse.json({ response: content }, { status: 200 });
//   } catch (error) {
//     logger.error("Error generating interview questions");
//     console.error(error);

//     return NextResponse.json(
//       { error: "internal server error" },
//       { status: 500 }
//     );
//   }
// }


// 🔥 NOTE: this file has been refactored to use Groq SDK instead of OpenAI, as Groq provides better performance and cost for our use case. The old code is commented out above for reference.


import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import {
  SYSTEM_PROMPT,
  generateQuestionsPrompt,
} from "@/lib/prompts/generate-questions";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function cleanJsonResponse(text: string): string {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function POST(req: Request) {
  logger.info("generate-interview-questions request received");

  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const body = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 3000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: generateQuestionsPrompt(body) },
      ],
    });

    let content = completion.choices[0]?.message?.content ?? "";

    // 🔥 IMPORTANT: sanitize markdown fences
    content = cleanJsonResponse(content);

    logger.info("Interview questions generated successfully");

    return NextResponse.json({ response: content }, { status: 200 });
  } catch (error: unknown) {
    logger.error(
      "Error generating interview questions",
      error instanceof Error ? error.message : String(error),
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
