import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data") || "https://www.hmtfinancialservices.com/portal";
  const size = searchParams.get("size") || "220x220";

  try {
    const response = await fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=${encodeURIComponent(size)}&data=${encodeURIComponent(data)}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "QR generation failed" }, { status: 502 });
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("QR proxy failed:", err);
    return NextResponse.json({ error: "QR proxy failed" }, { status: 500 });
  }
}
