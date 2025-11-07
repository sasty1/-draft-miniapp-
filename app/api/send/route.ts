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

    // Build payload for Neynar API
    const payload: any = {
      signer_uuid: process.env.NEYNAR_SIGNER_UUID, // ✅ Correct variable
      text: message,
    };

    if (imageUrl && imageUrl.trim() !== "") {
      payload.embeds = [{ url: imageUrl.trim() }];
    }

    // Send to Neynar API
    const response = await fetch("https://api.neynar.com/v2/farcaster/casts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY || "",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error from Neynar:", data);
      return NextResponse.json(
        { success: false, error: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
