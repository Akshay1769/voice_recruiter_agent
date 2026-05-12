import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const response = await fetch("http://13.48.166.164:8501/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
