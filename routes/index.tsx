import { useSignal } from "@preact/signals";
import Header from "../components/Header.tsx";
import UploadForm from "../islands/UploadForm.tsx";

export default function Page() {
  return (
    <>
      <Header />
      <div class="w-full max-w-screen-xl mx-auto p-4">
        <UploadForm />
      </div>
    </>
  );
}
