import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Draft & Scheduler",
    description: "Save, schedule, and auto-post Farcaster drafts.",
    iconUrl: "https://draft-miniapp.vercel.app/icon.png", // optional
    appUrl: "https://draft-miniapp.vercel.app",
    appDeveloper: {
      name: "sasty",
      contact: "https://warpcast.com/iam_sasty"
    }
  });
}
