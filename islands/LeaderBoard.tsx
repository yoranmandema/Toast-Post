import { Signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Tosti } from "../mongo/toastie.ts";
import { JSX } from "preact/jsx-runtime";
import { Rating } from "../mongo/rating.ts";

export default function Leaderboard() {
  const tostisSignal = useSignal<Tosti[]>([]);
  const pageSignal = useSignal<number>(1);
  const isLoadingSignal = useSignal<boolean>(false);
  const hasMoreSignal = useSignal<boolean>(true);

  async function getTostis() {
    if (isLoadingSignal.value || !hasMoreSignal.value) return;

    isLoadingSignal.value = true;

    const res = await fetch(
      `/api/tosti/getRanked?page=${pageSignal.value}&limit=10`,
    );

    const json = await res.json();

    const tostis = json as Tosti[];

    if (tostis.length === 0) {
      hasMoreSignal.value = false;
    } else {
      tostisSignal.value = [...tostisSignal.value, ...tostis];

      pageSignal.value = pageSignal.value + 1;
    }

    isLoadingSignal.value = false;
  }

  useEffect(() => {
    getTostis();

    const handleScroll = () => {
      if (
        globalThis.window.innerHeight + globalThis.window.scrollY >=
          document.body.offsetHeight - 100
      ) {
        getTostis();
      }
    };

    globalThis.window.addEventListener("scroll", handleScroll);
    return () => globalThis.window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div class="grid grid-flow-row xl:grid-cols-2 grid-cols-1 gap-4">
      {tostisSignal.value.map((tosti, i) => (
        <LeaderBoardItem index={i} tosti={tosti}></LeaderBoardItem>
      ))}
    </div>
  );
}

function LeaderBoardItem(props: {
  tosti: Tosti;
  index: number;
}) {
  const ratingSignal = useSignal<number>(0);

  async function onClickLike() {
    const res = await fetch(`/api/rating/post`, {
      method: "POST",
      body: JSON.stringify({
        id: props.tosti._id?.toString(),
      }),
    });

    if (res.ok) {
    }

    await getRating();
  }

  async function getRating() {
    const res = await fetch(
      `/api/rating/getFromId?id=${props.tosti._id?.toString()}`,
    );

    if (res.ok) {
      ratingSignal.value = ((await res.json()) as Rating).total ?? 0;
    } else {
      ratingSignal.value = 0;
    }
  }

  useEffect(() => {
    getRating();
  }, []);

  return (
    <span class="rounded-xl xl:p-4 p-2  bg-slate-800 flex flex-row gap-2">
      <span class="relative flex flex-col gap-2 w-full">
        <span class="font-normal text-1xl text-slate-400 ">
          Tosti
        </span>

        <span class="font-bold text-3xl text-slate-400 ">
          {props.tosti.name}
        </span>

        <img
          src={props.tosti.imgUrl ??
            "https://www.justspices.co.uk/media/recipe/Air-Fryer-Cheese-Toastie_Just-Spices_1_.webp"}
          class="relative aspect-[5/3] w-full object-cover rounded-lg"
        >
        </img>

        <span class="absolute bottom-4 right-4 flex flex-row gap-4 justify-end">
          <Stat
            onClick={onClickLike}
            label={"❤️"}
            amount={ratingSignal.value}
          >
          </Stat>
        </span>
      </span>
    </span>
  );
}

function Stat(
  props: {
    label: Signal<string> | string;
    amount: Signal<number> | number;
  } & JSX.HTMLAttributes<HTMLSpanElement>,
) {
  return (
    <span
      {...props}
      class="flex flex-row items-center gap-1 text-slate-400 text-3xl rounded-lg bg-slate-700 hover:bg-slate-600 p-1 border hover:border-slate-200 border-slate-700 cursor-pointer"
    >
      <span>{props.label}</span>
      <span class="0 font-bold">{props.amount}</span>
    </span>
  );
}
