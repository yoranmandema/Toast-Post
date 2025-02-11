import { useSignal } from "@preact/signals";

export default function UploadForm() {
  const hasUploadedSignal = useSignal<boolean>(false);
  const isUploadingSignal = useSignal<boolean>(false);

  async function submit(event: Event) {
    isUploadingSignal.value = true;

    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nameInput = form.tostiName as HTMLInputElement;
    const creatorInput = form.creator as HTMLInputElement;
    const fileInput = form.image as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) return alert("Select a file!");

    const formData = new FormData();

    formData.append("image", file);

    if (nameInput.value) {
      formData.append("name", nameInput.value);
    }

    if (creatorInput.value) {
      formData.append("creator", creatorInput.value);
    }

    const response = await fetch("/api/tosti/post", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      hasUploadedSignal.value = true;
    }

    isUploadingSignal.value = false;
  }

  return (
    <>
      <form
        onSubmit={submit}
        class="flex flex-col gap-2 text-white rounded-2xl bg-slate-800 p-4 text-lg"
      >
        <span class="flex flex-col">
          <label for="creator">
            Name&nbsp;
            <span class="italic opacity-60">
              (add your name! - optional)
            </span>
          </label>
          <input
            name="creator"
            type="text"
            class="rounded-md bg-slate-700 border-electric_purple-700 p-1"
          >
          </input>
        </span>
        <span class="flex flex-col">
          <label for="tostiName">
            Tosti name&nbsp;
            <span class="italic opacity-60">
              (add a funny name to stand out - optional)
            </span>
          </label>
          <input
            name="tostiName"
            type="text"
            class="rounded-md bg-slate-700 border-electric_purple-700 p-1"
          >
          </input>
        </span>

        <span class="flex flex-col">
          <label for="image">
            Image <span class="italic opacity-60">(add your tosti image!)</span>
          </label>

          <input
            required
            type="file"
            id="myFile"
            name="image"
            class="rounded-2xl bg-slate-700 border-1 p-10 invalid:border-red-500"
          />
        </span>
        <input
          disabled={isUploadingSignal}
          class="cursor-pointer rounded-2xl invalid:border-red-500 disabled:bg-slate-700 text-white relative px-4 h-12 bg-gradient-to-br flex flex-col from-electric_purple-400 to-selective_yellow-500"
          type="submit"
        />
      </form>
    </>
  );
}
