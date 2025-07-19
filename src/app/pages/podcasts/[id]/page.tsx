/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import AudioPlayer from "@/components/AudioPlayer";
import { Heart, MessageCircle } from "lucide-react";
import CommentSection from "@/components/CommentSection";
import clsx from "clsx";

type PodcastDetail = {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl: string;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
  uploader: {
    id: string;
    name: string;
    email: string;
  };
  comments: any[];
  likeCount: number;
  isLiked: boolean; // ✅ Now handled directly
};

export default function PodcastDetailPage() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState<PodcastDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        if (!id || typeof id !== "string") return;

        const res = await axios.get(`/api/podcasts/podcastById/${id}`);
        const podcastData = res.data;

        setPodcast(podcastData);
        setLikeCount(podcastData.likeCount || 0);
        setIsLiked(podcastData.isLiked || false); // ✅ trusted from server
      } catch (err) {
        console.error("Error fetching podcast:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  const handleToggleLike = async () => {
    if (!id || typeof id !== "string" || likeLoading) return;

    try {
      setLikeLoading(true);
      const token = getToken();

      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const endpoint = isLiked
        ? "/api/podcasts/unlike"
        : "/api/podcasts/like";

      const res = await axios.post(
        endpoint,
        { podcastId: id },
        { headers }
      );

      if (res.status === 200 || res.status === 201) {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error || "Something went wrong toggling like";

      if (message.includes("already liked")) {
        setIsLiked(true);
        console.warn("Already liked");
      } else {
        console.error("Like error:", message);
        alert(message);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-zinc-500">Loading podcast...</div>
    );
  }

  if (!podcast) {
    return (
      <div className="p-6 text-center text-red-500">Podcast not found.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Cover Image */}
      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow">
        <Image
          src={podcast.imageUrl || "/placeholder.jpg"}
          alt={podcast.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Title & Description */}
      <div>
        <h1 className="text-3xl font-bold">{podcast.title}</h1>
        <p className="text-zinc-600 dark:text-zinc-300 mt-2">
          {podcast.description}
        </p>
      </div>

      {/* Audio Player */}
      <AudioPlayer audioUrl={podcast.audioUrl} title={podcast.title} />

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {podcast.tags.length > 0 ? (
          podcast.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-zinc-200 dark:bg-zinc-800 text-sm px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))
        ) : (
          <span className="text-sm text-zinc-500">No tags</span>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div>
          Uploaded by <strong>{podcast.uploader.name}</strong>{" "}
          on {format(new Date(podcast.createdAt), "dd MMM yyyy")}
        </div>

        <div className="flex gap-4 items-center mt-2 sm:mt-0">
          <button
            onClick={handleToggleLike}
            disabled={likeLoading}
            className={clsx(
              "flex items-center gap-1 text-sm font-medium transition-colors",
              isLiked ? "text-red-500" : "text-zinc-500 hover:text-red-400",
              likeLoading && "opacity-50 pointer-events-none"
            )}
          >
            <Heart
              size={18}
              fill={isLiked ? "currentColor" : "none"}
              className="transition-transform duration-150"
            />
            <span>{likeCount}</span>
          </button>

          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            <span>{podcast.comments?.length ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection podcastId={String(id)} />
    </div>
  );
}
