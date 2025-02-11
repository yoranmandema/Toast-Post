import { Handlers, FreshContext } from "$fresh/server.ts";
import { tostiService } from "../../../mongo/toastie.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const tostis = await tostiService.getAll();

    return Response.json(tostis);
  }
}