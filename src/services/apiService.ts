import { createApiClient } from "./ApiServiceConfig";
import { setupInterceptors } from "./apiInterceptor";

const privateApiClient = createApiClient();
const publicApiClient = createApiClient();

setupInterceptors(privateApiClient, publicApiClient);

export const apiService = {
  privateApiClient,
  publicApiClient,
};

export default apiService;
