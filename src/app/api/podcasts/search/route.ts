/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query") || "";
        const tag = searchParams.get("tag");

        // Build where conditions
        const where: any = {
            AND: []
        };

        if (query) {
            where.AND.push({
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } }
                ]
            });
        }

        if (tag) {
            where.AND.push({
                tags: { has: tag }
            });
        }

        const podcasts = await prisma.podcast.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                imageUrl: true,
                description: true,
                audioUrl: true,
                tags: true,
                createdAt: true,
                uploadedBy: true
            }
        });

        return NextResponse.json({ podcasts }, { status: 200 });
    } catch (err) {
        console.error("Search API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
