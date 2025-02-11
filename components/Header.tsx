export default function Header() {
  return (
    <div class="text-white relative  bg-gradient-to-br flex flex-col xl:gap-8 from-electric_purple-400 to-selective_yellow-500 xl:p-32 p-4">
      <span class="xl:text-[100px] text-3xl font-extrabold">
        Toast <span class="rotate-45">Post</span>!
      </span>
      <span class="xl:text-xl text-lg italic translate-x-4 opacity-75">
        The tosti leaderboard
      </span>

      <span class="italic absolute bottom-0 right-4 font-medium xl:text-sm text-[8px]">
        Brought to you by the Tosti Hustlers
      </span>
    </div>
  );
}
