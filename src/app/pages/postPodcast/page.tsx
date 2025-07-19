/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UploadPodcastPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!title || !description || !tags || !audioFile || !imageFile) {
      alert("All fields are required!");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags); // comma separated
      formData.append("file", audioFile);
      formData.append("image", imageFile);

      const token = localStorage.getItem("token");

      const res = await axios.post("/api/podcasts/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
       toast.success("✅ Podcast uploaded successfully!")
        router.push("/pages/dashboard"); // or your desired route
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">📤 Upload Your Podcast</h2>

      {/* 🖼 Cover Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Cover Image</label>
        {imagePreview && (
          <div className="mb-3">
            <Image
              src={imagePreview}
              alt="Cover Preview"
              width={300}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* 🎧 Audio Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Audio File</label>
        <input type="file" accept="audio/*" onChange={handleAudioChange} />
      </div>

      {/* 📝 Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., The Rise of AI"
        />
      </div>

      {/* 📄 Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a short description of your podcast..."
        ></textarea>
      </div>

      {/* 🏷 Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Tags (comma separated)
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., tech, ai, future"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-black text-white px-6 py-2 rounded-md hover:bg-zinc-800 transition"
      >
        {uploading ? "Uploading..." : "Upload Podcast"}
      </button>
    </div>
  );
}
