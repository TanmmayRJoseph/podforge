import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Podcast ID is required" },
        { status: 400 }
      );
    }

    // 🔐 Get token from cookies or header
    const cookieToken = request.cookies.get("token")?.value;
    const headerToken = request.headers.get("Authorization")?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    let userId: string | null = null;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        userId = decoded.id;
      } catch (err) {
        console.warn(err);
        console.warn("Invalid token provided");
      }
    }

    // 🔍 Fetch podcast
    const podcast = await prisma.podcast.findUnique({
      where: { id },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        likes: {
          select: { id: true, userId: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            text: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!podcast) {
      return NextResponse.json(
        { error: "Podcast not found" },
        { status: 404 }
      );
    }

    const likeCount = podcast.likes.length;

    const isLiked = userId
      ? podcast.likes.some((like) => like.userId === userId)
      : false;

    return NextResponse.json(
      {
        ...podcast,
        likeCount,
        isLiked,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching podcast:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
