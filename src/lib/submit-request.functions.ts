import { createServerFn } from "@tanstack/react-start";

import { deliverRequest } from "./request-delivery.server";
import { parseRequestFormData } from "./request";

export const submitRequest = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }
    return parseRequestFormData(data);
  })
  .handler(async ({ data }) => deliverRequest(data));
