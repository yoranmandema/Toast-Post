import { FreshContext, Handlers } from "$fresh/server.ts";
import { firebaseClient } from "../../../firebase/firebase.ts";
import { ratingService } from "../../../mongo/rating.ts";
import { TostiService, tostiService } from "../../../mongo/toastie.ts";
import { Tosti } from "../../../mongo/toastie.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext) {
    try {
      const form = await req.formData();
      const name = form.get("name") as string;
      const creator = form.get("creator") as string;
      const file = form.get("image") as File;

      if (!file) {
        return new Response(JSON.stringify({ error: "No file uploaded" }), {
          status: 400,
        });
      }

      const imageUrl = await firebaseClient.uploadImage(file);

      if (!imageUrl) throw "Image upload failed!";

      const tosti: Tosti = {
        imgUrl: imageUrl,
      };

      if (name) {
        tosti.name = name;
      }

      if (creator) {
        tosti.creator = creator;
      }

      const createRes = await tostiService.create(tosti);

      if (createRes.insertedId) {
        const ratingRes = await ratingService.create({
          topic: createRes.insertedId,
          total: 0,
        });
      }

      return new Response(JSON.stringify(createRes), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: "poo" }), { status: 500 });
    }
  },
};
