import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(request: NextRequest) {
    try {
        const podcasts = await prisma.podcast.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                description: true,
                audioUrl: true,
                tags: true,
                imageUrl: true,
                createdAt: true,
                uploader: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(podcasts, { status: 200 });

    } catch (error) {
        console.error("Error fetching podcasts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}