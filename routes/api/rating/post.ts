import { FreshContext, Handlers } from "$fresh/server.ts";
import { ObjectId } from "mongo";
import { ratingService } from "../../../mongo/rating.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext) {
    try {
        const json = await req.json();
    
        const id = json.id;

        const existingRatings = await ratingService.find({topic: new ObjectId(id)});
        const existingRating = existingRatings[0]

        if (existingRating) {
            existingRating.total = (existingRating.total ?? 0) + 1;

            ratingService.upsert({_id: existingRating._id}, existingRating)
        } else {
            ratingService.create({topic: new ObjectId(id), total: 1})
        }

        return new Response("ok", { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: "poo" }), { status: 500 });
    }
  },
};
