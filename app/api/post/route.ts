import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await axios.post(
      "https://api.neynar.com/v2/farcaster/casts",
      {
        signer_uuid: process.env.FARCASTER_SIGNER_UUID,
        text,
      },
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Farcaster Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
