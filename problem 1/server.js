import express from "express";
import cors from "cors";
import axios from "axios";
const PORT = 8080;

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello world !" });
});

//social media analytics micro service
//return top 5 users with highest number of liked posts
app.get("/users", async (req, res) => {
  const getAuthUrl = "http://20.244.56.144/test/auth";

  try {
    const { data: authData } = await axios.post(getAuthUrl, {
      companyName: "goMart",
      clientID: "41082f8d-fff4-4596-a1ba-81310d02b0d0",
      clientSecret: "uLBepJEmUiyYyRrG",
      ownerName: "Rahul",
      ownerEmail: "sabarish.vs.aiml.2022@snsct.org",
      rollNo: "713522AM081",
    });

    const token = authData.access_token;

    const getUsersUrl = "http://20.244.56.144/test/users";
    const { data: usersData } = await axios.get(getUsersUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const postCounts = await Promise.all(
      Object.entries(usersData.users).map(async ([id, name]) => {
        try {
          const { data } = await axios.get(
            `http://20.244.56.144/test/users/${id}/posts`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return { id, name, count: data.posts.length };
        } catch (error) {
          console.error(`Error fetching posts for user ${id}:`, error.message);
        }
      })
    );
    const topUsers = postCounts.sort((a, b) => b.postCount - a.postCount);

    const topUsersResponse = topUsers.slice(0, 5);

    res.status(200).json({ usersWithPostCounts: topUsersResponse });
  } catch (err) {
    console.error("Error:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch users", details: err.message });
  }
});

app.get("/posts", async (req, res) => {
  const { type } = req.query;

  if (type === "popular") {
    const getAuthUrl = "http://20.244.56.144/test/auth";

    try {
      const { data: authData } = await axios.post(getAuthUrl, {
        companyName: "goMart",
        clientID: "41082f8d-fff4-4596-a1ba-81310d02b0d0",
        clientSecret: "uLBepJEmUiyYyRrG",
        ownerName: "Rahul",
        ownerEmail: "sabarish.vs.aiml.2022@snsct.org",
        rollNo: "713522AM081",
      });

      const token = authData.access_token;

      const getUsersUrl = "http://20.244.56.144/test/users";
      const { data: usersData } = await axios.get(getUsersUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let maxComments = 0;
      let mostCommentedPosts = [];

      for (const [id, name] of Object.entries(usersData.users)) {
        try {
          const { data: postsData } = await axios.get(
            `http://20.244.56.144/test/users/${id}/posts`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          for (const post of postsData.posts) {
            try {
              const { data: commentsData } = await axios.get(
                `http://20.244.56.144/test/posts/${post.id}/comments`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              const commentCount = commentsData.comments.length;

              if (commentCount > maxComments) {
                maxComments = commentCount;
                mostCommentedPosts = [{ ...post, commentCount }];
              } else if (commentCount === maxComments) {
                mostCommentedPosts.push({ ...post, commentCount });
              }
            } catch (error) {
              console.error(
                `Error fetching comments for post ${post.id}:`,
                error.message
              );
            }
          }
        } catch (error) {
          console.error(`Error fetching posts for user ${id}:`, error.message);
        }
      }

      res.status(200).json({ mostCommentedPosts, maxComments });
    } catch (err) {
      console.error("Error:", err.message);
      res
        .status(500)
        .json({ error: "Failed to fetch data", details: err.message });
    }
  } else if (type === "latest") {
    const getAuthUrl = "http://20.244.56.144/test/auth";

    try {
      const { data: authData } = await axios.post(getAuthUrl, {
        companyName: "goMart",
        clientID: "41082f8d-fff4-4596-a1ba-81310d02b0d0",
        clientSecret: "uLBepJEmUiyYyRrG",
        ownerName: "Rahul",
        ownerEmail: "sabarish.vs.aiml.2022@snsct.org",
        rollNo: "713522AM081",
      });

      const token = authData.access_token;
      const getUsersUrl = "http://20.244.56.144/test/users";
      const { data: usersData } = await axios.get(getUsersUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let allPosts = [];

      for (const [id, name] of Object.entries(usersData.users)) {
        try {
          const { data: postsData } = await axios.get(
            `http://20.244.56.144/test/users/${id}/posts`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          allPosts.push(...postsData.posts);
        } catch (error) {
          console.error(`Error fetching posts for user ${id}:`, error.message);
        }
      }

      allPosts.sort((a, b) => b.id - a.id);

      const latestPosts = allPosts.slice(0, 5);

      res.status(200).json({ latestPosts });
    } catch (err) {
      console.error("Error:", err.message);
      res
        .status(500)
        .json({ error: "Failed to fetch data", details: err.message });
    }
  } else {
    res.status(400).send("Invalid parameter");
  }
});

app.listen(PORT, () => {
  console.log("Server started running on port: " + PORT);
});
