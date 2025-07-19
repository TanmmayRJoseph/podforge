import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET() {
  try {
    const podcasts = await prisma.podcast.findMany({
      take: 10,
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        audioUrl: true,
        imageUrl: true,
        tags: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
          },
        },
        uploader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map to expected structure: likeCount instead of _count.likes
    const formatted = podcasts.map(podcast => ({
      ...podcast,
      likeCount: podcast._count.likes,
    }));

    return NextResponse.json({ podcasts: formatted }, { status: 200 });
  } catch (error) {
    console.error("Error fetching popular podcasts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
