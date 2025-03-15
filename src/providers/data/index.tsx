import { GraphQLClient } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";

export const API_URL = "https://api.crm.refine.dev";

// graphql client - To make requests to the GraphQL API
export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});
