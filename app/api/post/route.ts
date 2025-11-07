import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, imageUrl } = await req.json();

    console.log("Received message:", message);
    console.log("Received image URL:", imageUrl);

    // If you want to do something with the data (example sending to API),
    // you can use fetch here instead of axios.
    // Example:
    //
    // const response = await fetch("https://api.example.com/send", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message, imageUrl }),
    // });

    return NextResponse.json({ success: true, message: "Post received" });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
