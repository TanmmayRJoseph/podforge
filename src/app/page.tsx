"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PodcastCard from "@/components/PodcastCard";
import Link from "next/link";

type Podcast = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  audioUrl: string;
  tags: string[];
  createdAt: string;
  uploadedBy: string;
};

export default function Home() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/api/podcasts/recent");
        const data = await res.json();
  
        console.log("API /recent response:", data); // 👈 LOG this!
  
        if (!data || !Array.isArray(data.podcasts)) {
          console.error("Unexpected response structure:", data);
          return;
        }
  
        setPodcasts(data.podcasts);
      } catch (err) {
        console.error("Failed to fetch recent podcasts:", err);
      } finally {
        setLoading(false);
      }
    }
  
    fetchRecent();
  }, []);
  
  

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <motion.h1
            className="text-4xl md:text-6xl font-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to Podforge 🎙️
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover, upload, and share audio stories with the world. Your voice
            matters.
          </motion.p>
          <motion.a
            href="/pages/login"
            className="inline-block mt-4 bg-white text-indigo-700 font-medium py-3 px-6 rounded-full hover:bg-indigo-100 transition"
            whileHover={{ scale: 1.05 }}
          >
            🎧 Start Listening
          </motion.a>
        </div>
      </section>

      {/* Recent Podcasts */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-6">
          📻 Recently Uploaded Podcasts
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading podcasts...</p>
        ) : podcasts?.length === 0 ? (
          <p className="text-gray-500">No recent podcasts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {podcasts.map((podcast) => (
              <Link key={podcast.id} href={`/pages/podcasts/${podcast.id}`}>
                <PodcastCard
                  id={podcast.id}
                  title={podcast.title}
                  description={podcast.description}
                  imageUrl={podcast.imageUrl || "/placeholder.jpg"}
                  createdAt={podcast.createdAt}
                  uploader={{ id: podcast.uploadedBy, name: "Uploader" }}
                />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
