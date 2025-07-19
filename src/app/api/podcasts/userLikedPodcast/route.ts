/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // 🧠 Get token from header
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

    // 🎯 Fetch all podcasts liked by the user (with full info)
    const likedPodcasts = await prisma.podcast.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 🧮 Add likeCount field to each
    const podcastsWithLikeCount = likedPodcasts.map((podcast) => ({
      ...podcast,
      likeCount: podcast.likes.length,
    }));

    return NextResponse.json({ podcasts: podcastsWithLikeCount }, { status: 200 });

  } catch (err) {
    console.error("Error fetching liked podcasts:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
