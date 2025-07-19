/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { subDays } from "date-fns";

export async function GET() {
  try {
    const today = new Date();
    const tenDaysAgo = subDays(today, 10);

    const podcasts = await prisma.podcast.findMany({
      where: {
        createdAt: {
          gte: tenDaysAgo,
          lte: today,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // No need to map if the property is already named `uploader`
    return NextResponse.json({ podcasts }, { status: 200 });
  } catch (error: any) {
    console.error("🔥 Error in /api/podcasts/recent:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
