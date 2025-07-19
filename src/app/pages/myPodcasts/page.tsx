"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

type Podcast = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  audioUrl?: string;
  tags?: string[];
  createdAt: string;
};

export default function MyPodcastPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPodcasts = async () => {
      try {
        const res = await axios.get("/api/users/my-podcasts", {
          withCredentials: true, // Sends cookies (JWT)
        });
        setPodcasts(res.data.podcasts || []);
      } catch (err) {
        console.error("Failed to fetch my podcasts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPodcasts();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🎙 My Podcasts</h1>

      {loading ? (
        <p className="text-zinc-400">Loading your podcasts...</p>
      ) : podcasts.length === 0 ? (
        <p className="text-zinc-400">You haven’t uploaded any podcasts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="bg-zinc-800 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Image Preview */}
              {podcast.imageUrl && (
                <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden">
                  <Image
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Title + Description */}
              <h2 className="text-lg font-semibold truncate">{podcast.title}</h2>
              <p className="text-zinc-400 text-sm line-clamp-2 mb-2">
                {podcast.description}
              </p>

              {/* Date */}
              <p className="text-xs text-zinc-500">
                Uploaded on {format(new Date(podcast.createdAt), "dd MMM yyyy")}
              </p>

              {/* Link to Detail Page */}
              <Link
                href={`/pages/podcasts/${podcast.id}`}
                className="inline-block mt-2 text-sm text-blue-400 hover:underline"
              >
                View Podcast →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
