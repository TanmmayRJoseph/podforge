import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    // 🔐 Verify token
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

    // 📥 Parse body
    const { podcastId, text } = await request.json();

    if (!podcastId || !text) {
      return NextResponse.json({ error: "Podcast ID and text are required" }, { status: 400 });
    }

    // 💾 Create comment and include user data
    const comment = await prisma.comment.create({
      data: {
        podcastId,
        userId,
        text,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Comment added",
        comment,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Comment API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
