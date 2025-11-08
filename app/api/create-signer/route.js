import { NextResponse } from "next/server";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

export async function POST() {
  try {
    const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

    // Create a new signer
    const signer = await client.createSigner();

    return NextResponse.json({
      success: true,
      signer_uuid: signer.signer_uuid,
      signer_private_key: signer.signer_private_key,
    });
  } catch (error) {
    console.error("Error creating signer:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
