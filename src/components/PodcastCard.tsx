"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type PodcastCardProps = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  uploader: {
    id: string;
    name: string;
  };
  likeCount?: number;
};

export default function PodcastCard({
  id,
  title,
  description,
  imageUrl,
  createdAt,
  uploader,
  likeCount,
}: PodcastCardProps) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const date = new Date(createdAt);
    const formatter = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setFormattedDate(formatter.format(date));
  }, [createdAt]);

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm rounded-2xl shadow-md border bg-white dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden"
    >
      <Link href={`/pages/podcasts/${id}`} className="block">
        {imageUrl && (
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-4 space-y-1">
          <h2 className="text-lg font-semibold line-clamp-1">{title}</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {description}
          </p>
          <div className="text-xs text-zinc-500 mt-2 flex justify-between items-center">
            <span>
              Uploaded by{" "}
              <span className="font-medium">{uploader.name}</span>
              {formattedDate && ` · ${formattedDate}`}
            </span>
            {likeCount !== undefined && (
              <span className="text-red-500 font-medium ml-2">
                ❤️ {likeCount}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
