import { createServerFn } from "@tanstack/react-start";

import { deliverOrder } from "./order-delivery.server";
import { parseOrderFormData } from "./order";

export const submitOrder = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }
    return parseOrderFormData(data);
  })
  .handler(async ({ data }) => deliverOrder(data));
