import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const podcastId = url.searchParams.get("podcastId");

        if (!podcastId) {
            return NextResponse.json({ error: "Podcast ID is required" }, { status: 400 });
        }

        const comments = await prisma.comment.findMany({
            where: { podcastId },
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
        });

        return NextResponse.json({ comments }, { status: 200 });

    } catch (err) {
        console.error("Fetch comments error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
