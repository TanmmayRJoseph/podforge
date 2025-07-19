"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PodcastCard from "@/components/PodcastCard";

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const tag = searchParams.get("tag");

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get("/api/podcasts/search", {
          params: {
            query,
            tag,
          },
        });
        setPodcasts(res.data.podcasts);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (query || tag) fetchSearchResults();
  }, [query, tag]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">
        🔍 Results for{" "}
        <span className="font-medium">&quot;{query || tag}&quot;</span>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : podcasts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <PodcastCard
              key={podcast.id}
              id={podcast.id}
              title={podcast.title}
              description={podcast.description}
              imageUrl={podcast.imageUrl}
              createdAt={podcast.createdAt}
              uploader={{ id: podcast.uploadedBy, name: "Unknown" }} // or fetch uploader separately
            />
          ))}
        </div>
      ) : (
        <p>No podcasts found.</p>
      )}
    </div>
  );
}
