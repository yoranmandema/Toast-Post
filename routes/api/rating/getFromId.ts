import { ObjectId } from "mongo";
import { ratingService } from "../../../mongo/rating.ts";
import { Handlers, FreshContext } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    try {
       
        const url = new URL(req.url);

        const topicId = url.searchParams.get("id")

        if (!topicId) return new Response(null, { status: 404 }); 

        const rating = await ratingService.find({topic: new ObjectId(topicId)})

        if (!rating.length) return new Response(null, { status: 404 }); 

        console.log(rating)

        return Response.json(rating[0]);
    } catch (error: any) {
        console.error(error)

        return new Response(JSON.stringify({ error: "poo" }), { status: 500 });
    }
  },
};
