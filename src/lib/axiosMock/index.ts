import MockAdapter from "axios-mock-adapter";

import { apiClient } from "@/lib/axios";

import { registerOrderMocks } from "./response/order";

const mock = new MockAdapter(apiClient, { delayResponse: 500, onNoMatch: "passthrough" });

registerOrderMocks(mock);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    mock.restore();
  });
}

export { mock };
