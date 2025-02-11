import { ObjectId } from "mongo";
import { MongoDocument } from "./mongoDocument.ts";
import Service from "./service.ts";

export type Rating = MongoDocument & {
  topic?: ObjectId;
  total?: number;
};

export class RatingService extends Service<Rating> {
}

export const ratingService = new RatingService({
  dbName: "toast-post",
  collectionName: "rating"
});