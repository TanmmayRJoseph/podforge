import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { supabase } from "@/utils/supabaseClient";

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const podcastId = searchParams.get("id");

        if (!podcastId) {
            return NextResponse.json({ error: "Podcast ID is required" }, { status: 400 });
        }

        // 🔍 Get podcast metadata from DB
        const podcast = await prisma.podcast.findUnique({
            where: { id: podcastId },
        });

        if (!podcast) {
            return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
        }

        // Assuming you stored full public URL — parse path from it
        const urlObj = new URL(podcast.audioUrl);
        const path = decodeURIComponent(urlObj.pathname.replace(`/storage/v1/object/public/podcasts/`, ""));

        // 🔑 Generate signed URL (valid for 1 hour)
        const { data, error } = await supabase.storage
            .from("podcasts")
            .createSignedUrl(path, 60 * 60);  // 1 hour

        if (error || !data?.signedUrl) {
            console.error("Signed URL error:", error);
            return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
        }

        return NextResponse.json(
            { signedUrl: data.signedUrl },
            { status: 200 }
        );

    } catch (error) {
        console.error("Stream API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
