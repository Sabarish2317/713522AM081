import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../consts";

interface Feed {
  id: number;
  userid: number;
  content: string;
}

const Feeds: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<Feed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const { data } = await axios.get<{ latestPosts: Feed[] }>(
          `${BASE_URL}/posts`,
          {
            params: { type: "latest", limit: 5 }, // Fetch latest posts
          }
        );

        setLatestPosts(data.latestPosts);
      } catch (err) {
        setError("Failed to fetch latest posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4  min-w-[350px] self-start bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold">Latest Posts</h2>
      <div>
        {latestPosts.map((post) => (
          <div key={post.id} className="py-3 flex flex-col">
            <img
              className="w-20 rounded"
              src="/dummy.jpeg"
              alt="Post Thumbnail"
            />
            <span className="font-semibold">{post.content}</span>
            <span className="text-gray-500">User ID: {post.userid}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feeds;
