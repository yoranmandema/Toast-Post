import { Signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Tosti } from "../mongo/toastie.ts";

export default function TopSpots() {
  const tostisSignal = useSignal<Tosti[]>([]);

  async function getTostis() {
    const res = await fetch("/api/tosti/topRankedDaily");

    const json = await res.json();
    
    tostisSignal.value = json as Tosti[];
  }

  useEffect(() => {
    getTostis();
  }, []);

  return (
    <div class="flex flex-row gap-4">
      {tostisSignal.value.map((tosti, i) => (
        <TopSpotItem index={i} tosti={tosti}></TopSpotItem>
      ))}
    </div>
  );
}

function TopSpotItem(props: {
  tosti: Tosti;
  index: number;
}) {
  return (
    <span class="rounded-xl p-2  bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col gap-2">
      <img
        src={props.tosti.imgUrl ??
          "https://www.justspices.co.uk/media/recipe/Air-Fryer-Cheese-Toastie_Just-Spices_1_.webp"}
        class="aspect-[5/3] w-full object-cover rounded-lg"
      >
      </img>
      <span class="flex flex-col p-4 gap-2">
        <span class="font-bold text-3xl text-slate-400 ">
          {props.tosti.name}
        </span>

        <span class="flex flex-row gap-4 justify-end">
          <Stat label={"❤️"} amount={2}></Stat>
        </span>
      </span>
    </span>
  );
}

function Stat(props: {
  label: Signal<string> | string;
  amount: Signal<number> | number;
}) {
  return (
    <span class="flex flex-row items-center gap-1 text-slate-400 text-3xl">
      <span>{props.label}</span>
      <span class="0 font-bold">{props.amount}</span>
    </span>
  );
}
