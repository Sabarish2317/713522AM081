import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../consts";

interface MostCommentedPost {
  id: string;
  userid: string;
  content: string;
  commentCount: number;
}

const MostCommentedPosts: React.FC = () => {
  const [topPosts, setTopPosts] = useState<MostCommentedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMostCommentedPosts = async () => {
      try {
        const { data } = await axios.get<{
          mostCommentedPosts: MostCommentedPost[];
        }>(`${BASE_URL}/posts`, {
          params: {
            type: "popular",
          },
        });

        setTopPosts(data.mostCommentedPosts);
      } catch (err) {
        setError("Failed to fetch most commented posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMostCommentedPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-[390px] self-start bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold">Top Most Commented Posts</h2>
      <div>
        {topPosts.map((post) => (
          <div key={post.id} className="py-3  flex flex-col">
            <img className="w-20" src="/dummy.jpeg" alt="" />
            <span className="font-semibold">{post.content}</span>
            <span className="text-gray-500">User ID: {post.userid}</span>
            <span className="font-bold text-purple-400">
              {post.commentCount} comments
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostCommentedPosts;
