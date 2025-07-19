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

export default function MyPodcastSection() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPodcasts = async () => {
      try {
        const res = await axios.get("/api/users/my-podcast", {
          withCredentials: true, // ✅ Send token cookie
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
    <div className="my-10 px-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">🎙 My Podcasts</h2>

      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : podcasts.length === 0 ? (
        <p className="text-zinc-400">You haven’t uploaded any podcasts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="bg-zinc-800 rounded-lg shadow p-4 hover:shadow-lg transition"
            >
              {podcast.imageUrl && (
                <div className="relative h-40 w-full mb-3">
                  <Image
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              )}

              <h3 className="text-lg font-semibold text-white truncate">{podcast.title}</h3>
              <p className="text-zinc-400 text-sm line-clamp-2 mb-2">
                {podcast.description}
              </p>

              <div className="text-xs text-zinc-500 mb-1">
                {format(new Date(podcast.createdAt), "dd MMM yyyy")}
              </div>

              <Link
                href={`/pages/podcast/${podcast.id}`}
                className="text-sm text-blue-400 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
