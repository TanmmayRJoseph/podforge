/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import PodcastCard from "@/components/PodcastCard";
import { motion } from "framer-motion";

export default function PopularPodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get("/api/podcasts/popular");
        setPodcasts(res.data.podcasts || []);
      } catch (err:any) {
        console.log(err);
        setError("Failed to load popular podcasts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">🔥 Popular Podcasts</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && podcasts.length === 0 && (
        <p className="text-gray-600">No popular podcasts found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {podcasts.map((podcast) => (
          <motion.div
            key={podcast.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <PodcastCard
              id={podcast.id}
              title={podcast.title}
              description={podcast.description}
              imageUrl={podcast.imageUrl}
              createdAt={podcast.createdAt}
              uploader={podcast.uploader || { id: "", name: "Unknown" }}
              likeCount={podcast._count?.likes || 0}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
