import {
  Collection,
  Db,
  Document,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
} from "mongo";
import mongoClientProvider from "./mongoClient.ts";

interface ServiceOptions {
  dbName: string;
  collectionName: string;
}

type Log = {
  message: string;
};

export interface ILogger {
  log(log: Log): Promise<void>;
}

export default class Service<T extends Document> {
  protected db: Db = {} as Db;
  protected collection: Collection<T> = {} as Collection<T>;
  private options: ServiceOptions;
  protected modelName: string;
  protected setupImportance = 0;

  private static _logger: ILogger | null;

  public static set logger(value: ILogger) {
    this._logger = value;
  }

  public static get logger() {
    return this._logger as ILogger;
  }

  public static services: Service<any>[] = [];

  constructor(options: ServiceOptions) {
    this.options = options;
    this.modelName = this.constructor.name.replace("Service", "")
      .toLowerCase();

    Service.services.push(this);

    Service.services = Service.services.sort((a, b) =>
      Math.sign(a.setupImportance - b.setupImportance)
    );
  }

  public async setup() {
    const mongoClient = mongoClientProvider.getClient();

    this.db = mongoClient.db(this.options.dbName);
    this.collection = this.db.collection(this.options.collectionName);

    const collectionExists = (await this.db.listCollections().toArray())
      .map(
        (c) => c.name,
      ).includes(this.options.collectionName);

    if (!collectionExists) {
      this.db.createCollection(this.options.collectionName);
      console.log(`Created ${this.constructor.name} collection`);
    }

    console.log(`Successfully setup ${this.constructor.name}`);
  }

  public async create(value: OptionalUnlessRequiredId<T>) {
    const res = await this.collection.insertOne(value);

    Service._logger?.log({
      message: `${res.insertedId} added`,
    });

    return res;
  }

  public async upsert(filter: Filter<T>, value: T) {
    const res = await this.collection.updateOne(filter, {
      $set: value,
    }, { upsert: true });

    if (res.modifiedCount > 0) {
      Service._logger?.log({
        message: `updated ${JSON.stringify(filter)} with ${
          JSON.stringify(value)
        }`,
      });
    }

    return res;
  }

  public async upsertMany(filter: Filter<T>, values: T) {
    return await this.collection.updateMany(filter, {
      $set: values,
    }, { upsert: true });
  }

  public async createMany(...values: T[]) {
    return await this.collection.insertMany(values as any[]);
  }

  public async delete(filter: Filter<T>) {
    const res = await this.collection.deleteOne(filter);

    Service._logger?.log({
      message: `${filter._id ?? "unknown"} deleted`,
    });

    return res;
  }

  public async deleteMany(filter: Filter<T>) {
    return await this.collection.deleteMany(filter);
  }

  public async getAll() {
    return (await this.collection.find({}).toArray()).map((i) => i as T);
  }

  public async getOneById(filter: Filter<T>): Promise<T | null> {
    return (await this.collection.findOne(filter) as unknown as Promise<
      T | null
    >);
  }

  public async getById(id: string | ObjectId) {
    const _id: ObjectId = typeof id === "string" ? new ObjectId(id) : id;

    return await this.collection.findOne({ _id } as Filter<T>);
  }

  public async find(filter: Filter<T>): Promise<T[]> {
    return (await this.collection.find(filter).toArray()).map((i) => i as T);
  }
}
