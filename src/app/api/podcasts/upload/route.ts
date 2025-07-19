/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import prisma from "@/utils/prisma";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import cloudinary from "@/utils/cloudinary";

export async function POST(request: NextRequest) {
  try {
    // 🔐 Token check
    const cookieToken = request.cookies.get("token")?.value;
    const headerToken = request.headers.get("Authorization")?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Please login to upload a podcast" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    // 📂 Get form data
    const formData = await request.formData();
    const fileBlob = formData.get("file");
    const imageBlob = formData.get("image");
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = (formData.get("tags") as string)?.split(",").map(tag => tag.trim());

    console.log("fileBlob:", fileBlob);
    console.log("imageBlob:", imageBlob);
    console.log("title:", title);
    console.log("description:", description);
    console.log("tags:", tags);






    if (!fileBlob || !title || !description || !tags || !imageBlob) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!(fileBlob instanceof Blob)) {
      return NextResponse.json({ error: "Invalid audio file" }, { status: 400 });
    }

    // ✅ Upload audio to Supabase
    const fileArrayBuffer = await fileBlob.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);
    const fileName = `${uuidv4()}-${(fileBlob as any).name || 'podcast.mp3'}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("podcasts")
      .upload(fileName, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: fileBlob.type || "audio/mpeg",
      });

    if (uploadError || !uploadData?.path) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Audio file upload failed" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("podcasts")
      .getPublicUrl(uploadData.path);

    // ✅ Upload image to Cloudinary (if provided)
    let imageUrl: string | null = null;

    if (imageBlob && imageBlob instanceof Blob) {
      const imageArrayBuffer = await imageBlob.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);

      const cloudinaryUpload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "podcasts" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        ).end(imageBuffer);
      });

      imageUrl = (cloudinaryUpload as any).secure_url;
    }

    // ✅ Save podcast to DB
    const podcast = await prisma.podcast.create({
      data: {
        title,
        description,
        audioUrl: urlData.publicUrl,
        imageUrl,  // New field
        tags,
        uploadedBy: userId,
      },
      select: {
        id: true,
        audioUrl: true,
        imageUrl: true,
        description: true,
        title: true,
        tags: true,
        uploadedBy: true,
      }
    });

    return NextResponse.json(
      {
        message: "Podcast uploaded",
        podcastId: podcast.id,
        audioUrl: podcast.audioUrl,
        description: podcast.description,
        title: podcast.title,
        tags: podcast.tags,
        uploadedBy: podcast.uploadedBy,
        imageUrl: podcast.imageUrl
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// API Response
/*
{
    "message": "Podcast uploaded",
    "podcastId": "95da2680-c31c-40e1-84da-594065cc7ca0",
    "audioUrl": "https://ptpokbvnqlghtjfvfwyt.supabase.co/storage/v1/object/public/podcasts/26400410-8435-410b-a2e6-19b6ab8dde62-sample-9s.mp3",
    "description": "description",
    "title": "audio title",
    "tags": [
        "test",
        "audio",
        "upload"
    ],
    "uploadedBy": "0c421ae1-fd83-4210-965a-dcbd320dd30b",
    "imageUrl": "https://res.cloudinary.com/dv4292z7m/image/upload/v1751791097/podcasts/xgsiuqpfm5ok0xnm2wuo.webp"
}
*/