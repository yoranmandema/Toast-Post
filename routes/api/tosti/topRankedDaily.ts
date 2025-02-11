/*
const page = 1; // Example page number
const limit = 10; // Number of objects per page
const skip = (page - 1) * limit;

const objectsWithRatings = await objectsCollection
  .aggregate([
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "topic",
        as: "ratings",
      },
    },
    {
      $addFields: {
        totalRating: { $sum: "$ratings.total" },
      },
    },
    {
      $sort: { totalRating: -1 }, // Sort by rating total in descending order
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ])
  .toArray();
*/

import { Handlers, FreshContext } from "$fresh/server.ts";
import { tostiService } from "../../../mongo/toastie.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const url = new URL(req.url);
    const tostis = await tostiService.getTopRankedDaily();

    return Response.json(tostis);
  }
}

