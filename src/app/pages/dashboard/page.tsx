"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import PodcastCard from "@/components/PodcastCard";
import PopularPodcastSection from "@/components/PopularPodcastSection";
import "swiper/css";


// Shared type
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

export default function Dashboard() {
  const [recentPodcasts, setRecentPodcasts] = useState<Podcast[]>([]);
  const [likedPodcasts, setLikedPodcasts] = useState<Podcast[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingLiked, setLoadingLiked] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get("/api/podcasts/recent");
        setRecentPodcasts(res.data.podcasts || []);
      } catch (err) {
        console.error("Failed to fetch recent podcasts:", err);
      } finally {
        setLoadingRecent(false);
      }
    };

    const fetchLiked = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("/api/podcasts/userLikedPodcast", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
console.log(res);
        setLikedPodcasts(res.data.podcasts || []);
      } catch (err) {
        console.error("Failed to fetch liked podcasts", err);
      } finally {
        setLoadingLiked(false);
      }
    };

    // 🧠 Call both in parallel
    fetchRecent();
    fetchLiked();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="h-screen px-4 py-8 space-y-10">
      {/* 🕒 Recent Uploads */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">
          🕒 Recent Uploads
        </h2>
        {loadingRecent ? (
          <p className="text-zinc-400">Loading...</p>
        ) : recentPodcasts.length === 0 ? (
          <p className="text-zinc-400">No recent podcasts found.</p>
        ) : (
          <Swiper spaceBetween={16} slidesPerView={"auto"}>
            {recentPodcasts.map((podcast) => (
              <SwiperSlide key={podcast.id} className="!w-[300px]">
                <PodcastCard {...podcast} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* 🔥 Popular Podcasts */}
      <PopularPodcastSection />

      {/* ❤️ Liked Podcasts */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">
          ❤️ Your Liked Podcasts
        </h2>
        {loadingLiked ? (
          <p className="text-zinc-400">Loading...</p>
        ) : likedPodcasts.length === 0 ? (
          <p className="text-zinc-400">You haven’t liked any podcasts yet.</p>
        ) : (
          <Swiper spaceBetween={16} slidesPerView={"auto"}>
            {likedPodcasts.map((podcast) => (
              <SwiperSlide key={podcast.id} className="!w-[300px]">
                <PodcastCard {...podcast} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
    </>
  );
}
