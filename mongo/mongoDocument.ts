import { ObjectId } from "mongo";

export interface MongoDocument {
  _id?: ObjectId;
}
