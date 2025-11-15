// app/api/send/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, imageUrl } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    const payload: Record<string, any> = {
      signer_uuid: process.env.NEYNAR_SIGNER_UUID, // <- match your env name
      text: message.trim(),
    };

    if (imageUrl && imageUrl.trim() !== "") {
      payload.embeds = [{ url: imageUrl.trim() }];
    }

    const resp = await fetch("https://api.neynar.com/v2/farcaster/cast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY ?? "",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("Error from Neynar:", data);
      return NextResponse.json({ success: false, error: data }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
