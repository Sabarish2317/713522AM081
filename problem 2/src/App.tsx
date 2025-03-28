import Feeds from "./components/Feed";
import TopFiveUsers from "./components/TopFiveUser";
import TrendingPosts from "./components/TrendingPosts";

function App() {
  return (
    <div className="main w-screen h-screen items-start justify-start p-6 flex flex-col gap-2 min-w-[350px] md:flex-row">
      <TopFiveUsers />
      <TrendingPosts />
      <Feeds />
    </div>
  );
}

export default App;
