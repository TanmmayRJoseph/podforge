import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    // 🔑 Authenticate
    const cookieToken = request.cookies.get("token")?.value;
    const headerToken = request.headers.get("Authorization")?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    // 📥 Get podcastId
    const { podcastId } = await request.json();

    if (!podcastId) {
      return NextResponse.json({ error: "Podcast ID is required" }, { status: 400 });
    }

    // 💥 Delete the like
    const deleted = await prisma.like.deleteMany({
      where: {
        podcastId,
        userId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "No like found to remove" }, { status: 404 });
    }

    return NextResponse.json({ message: "Podcast unliked successfully" }, { status: 200 });

  } catch (err) {
    console.error("Unlike API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
