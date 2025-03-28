import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../consts";

interface User {
  id: string;
  name: string;
  count: number;
}

const TopFiveUsers: React.FC = () => {
  const [TopUsers, SetTopUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get<{ usersWithPostCounts: User[] }>(
          `${BASE_URL}/users`
        );

        // Sort users by count in descending order and take the top 5
        const users = [...data.usersWithPostCounts];

        SetTopUsers(users);
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4  min-w-[350px] self-start bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold ">top 5 Users based by Posts</h2>
      <div>
        {TopUsers.map((user) => (
          <div key={user.id} className="py-2 flex justify-between">
            <span>{user.name}</span>
            <span className="font-bold">{user.count} posts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopFiveUsers;
