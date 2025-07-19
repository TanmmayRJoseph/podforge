"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { LoaderCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<null | {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoaderCircle className="animate-spin h-8 w-8 text-zinc-600 dark:text-zinc-300" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10 text-lg">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">👤 Your Profile</h1>

      <div className="bg-white dark:bg-zinc-900 shadow-md border rounded-xl p-6 space-y-4">
        <div>
          <span className="text-sm text-zinc-500">Name:</span>
          <p className="text-lg font-medium">{user.name}</p>
        </div>

        <div>
          <span className="text-sm text-zinc-500">Email:</span>
          <p className="text-lg">{user.email}</p>
        </div>

        <div>
          <span className="text-sm text-zinc-500">Joined On:</span>
          <p className="text-lg">
            {format(new Date(user.createdAt), "dd MMM yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
}
