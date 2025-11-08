import { NextResponse } from "next/server";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

export async function POST(req) {
  const { text, signer_uuid } = await req.json();

  if (!text || !signer_uuid) {
    return NextResponse.json({ error: "Missing text or signer" }, { status: 400 });
  }

  try {
    const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

    const cast = await client.publishCast({
      signerUuid: signer_uuid,
      text,
    });

    return NextResponse.json({ success: true, cast });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
