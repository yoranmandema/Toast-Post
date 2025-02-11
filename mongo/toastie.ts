import { MongoDocument } from "./mongoDocument.ts";
import Service from "./service.ts";

export type Tosti = MongoDocument & {
  imgUrl?: string;
  name?: string;
  creator?: string;
};

export class TostiService extends Service<Tosti> {
  public async getTopRankedDaily() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const topRatedToday = await this.collection.aggregate([
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
          todaysRatings: {
            $filter: {
              input: "$ratings",
              as: "rating",
              cond: { $gte: ["$$rating.createdAt", today] },
            },
          },
        },
      },
      {
        $addFields: {
          totalRatingToday: { $sum: "$todaysRatings.total" },
        },
      },
      {
        $sort: { totalRatingToday: -1 },
      },
      {
        $limit: 10, // Get the top 10 rated objects today
      },
      {
        $project: {
          ratings: 0, // Exclude full ratings array for efficiency
          todaysRatings: 0, // Exclude filtered ratings after sum calculation
        },
      },
    ]).toArray();

    return topRatedToday;
  }

  public async getRanked(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const objectsWithRatings = await this.collection
      .aggregate([
        {
          $lookup: {
            from: "rating",
            localField: "_id",
            foreignField: "topic",
            as: "rating",
          },
        },
        {
          $addFields: {
            totalRating: { $sum: "$rating.total" },
          },
        },
        {
          $sort: { totalRating: -1, _id: 1 }, // Ensure consistent sorting
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .toArray();

    return objectsWithRatings;
  }
}

export const tostiService = new TostiService({
  dbName: "toast-post",
  collectionName: "tosti",
});
