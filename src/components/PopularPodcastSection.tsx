"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PodcastCard from "@/components/PodcastCard";
import "swiper/css";

// Define the shape expected by PodcastCard
type Podcast = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  audioUrl?: string;
  tags?: string[];
  createdAt: string;
  likeCount?: number;
  uploader: {
    id: string;
    name: string;
  };
};

export default function PopularPodcastSection() {
  const [popular, setPopular] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch("/api/podcasts/popular");
        const data = await res.json();
        setPopular(data.podcasts || []);
      } catch (err) {
        console.error("Error fetching popular podcasts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-white mb-4 px-4">
      🔥 Popular Podcasts
      </h2>
      {loading ? (
        <p className="text-zinc-400 px-4">Loading...</p>
      ) : popular.length === 0 ? (
        <p className="text-zinc-400 px-4">No popular podcasts found.</p>
      ) : (
        <Swiper spaceBetween={16} slidesPerView={"auto"}>
          {popular.map((podcast) => (
            <SwiperSlide key={podcast.id} className="!w-[300px]">
              <PodcastCard {...podcast} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
