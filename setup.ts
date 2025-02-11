import { join } from "$std/path/mod.ts";
import mongoClientProvider from "./mongo/mongoClient.ts";
import Service from "./mongo/service.ts";

export default async function setup() {
  await mongoClientProvider.init();

  async function importAllServices(directory: string) {
    for await (const entry of Deno.readDir(directory)) {
      if (entry.isDirectory) {
        await importAllServices(join(directory, entry.name));
      } else if (entry.isFile) {
        await import("file://" + join(directory, entry.name));
      }
    }
  }

  await importAllServices(await Deno.realPath("./mongo"));

  for (const service of Service.services) {
    await service.setup();
  }
}
