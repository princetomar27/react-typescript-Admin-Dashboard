import graphqlDataProvider, {
  liveProvider as graphqlLiveProvider,
  GraphQLClient,
} from "@refinedev/nestjs-query";
import { ACCESS_TOKEN_KEY, fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = "https://api.crm.refine.dev";
export const WS_URL = "wss://api.crm.refine.dev/graphql";

// graphql client - To interact with GraphQLClient
export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;

// To make requests to the GraphQL API
export const dataProvider = graphqlDataProvider(client);

// live Provider - To make subscriptions to live Graphql API
export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient)
  : undefined;
