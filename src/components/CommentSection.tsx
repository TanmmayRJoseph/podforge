"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

// 👇 Your other podcast-specific props here
type Comment = {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
};

type Props = {
  podcastId: string;
};

export default function PodcastDetailPage({ podcastId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/podcasts/all-comments?podcastId=${podcastId}`);
        setComments(res.data.comments);
      } catch (err) {
        console.error("Error fetching comments", err);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [podcastId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(
        "/api/podcasts/comment",
        { podcastId, text },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Use auth if needed
          },
        }
      );

      setComments((prev) => [res.data.comment, ...prev]);
      setText("");
      toast.success("Comment posted successfully!");
    } catch (err) {
      console.error("Failed to post comment", err);
      setError("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">💬 Comments</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          rows={3}
          placeholder="Write a comment..."
          className="w-full p-3 rounded-md border dark:bg-zinc-900 dark:text-white dark:border-zinc-700"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* Comments List */}
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-zinc-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-md"
            >
              <div className="text-sm text-zinc-500 mb-1">
                <strong>{comment.user.name}</strong> ·{" "}
                {format(new Date(comment.createdAt), "dd MMM yyyy")}
              </div>
              <p className="text-zinc-800 dark:text-zinc-200">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
