import Header from "../components/Header.tsx";
import Leaderboard from "../islands/LeaderBoard.tsx";
import QRCode from "../islands/QRCode.tsx";
import TopSpots from "../islands/TopSpots.tsx";

export default function Page() {
  return (
    <>
      <Header />

      <div class="p-20 mx-auto my-auto h-full max-w-screen-xl w-full">
        <span class="text-slate-400 font-bold text-2xl py-2">
          Top 3 tostis of the day
        </span>
        <TopSpots></TopSpots>

        <QRCode class="bottom-8 right-8 fixed"></QRCode>
      </div>
    </>
  );
}
