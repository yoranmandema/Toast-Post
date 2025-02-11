import Header from "../components/Header.tsx";
import Leaderboard from "../islands/LeaderBoard.tsx";

export default function Page() {
  return (
    <>
      <Header />
      <div class="w-full max-w-screen-xl mx-auto p-4">
        <Leaderboard />
      </div>
    </>
  );
}
