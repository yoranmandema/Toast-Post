import { MongoClient } from "mongo";

export class MongoClientProvider {
  private mongoClient: MongoClient = {} as MongoClient;
  private hasInitialised = false;

  public async init() {
    if (this.hasInitialised) return;

    let uri;

    try {
      const secret = (await Deno.readTextFile(
        "/run/secrets/mongodb-root-password",
      )).trimEnd();

      uri = `mongodb://root:${secret}@mongodb:27017/`;
    } catch {
      uri = Deno.env.get("MONGODB_URI")!;
    }

    if (!uri) {
      throw new Error(
        "Neither /run/secrets/mongodb-root-password nor MONGODB_URI is available!",
      );
    }

    console.log(`Creating mongo client @ ${uri}...`);

    try {
      this.mongoClient = new MongoClient(uri);
      console.log("Connecting to MongoDB Atlas cluster...");
      await this.getClient().connect();
      console.log("Successfully connected to MongoDB Atlas!");
    } catch (error) {
      console.error("Connection to MongoDB Atlas failed!", error);
    }

    this.hasInitialised = true;
  }

  public getClient(): MongoClient {
    return this.mongoClient as MongoClient;
  }
}

const mongoClientProvider = new MongoClientProvider();

export default mongoClientProvider;
