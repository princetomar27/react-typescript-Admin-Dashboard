import { GraphQLFormattedError } from "graphql";

export const ACCESS_TOKEN_KEY = "access_token";

type Error = {
  message: string;
  statusCode: string;
};

// Custom fetchm, which is wrapped around the built-in fetch to Add Authorization headers
const customFetch = async (url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || `Bearer ${accessToken}`, // Add Authorization header with Bearer token
      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

// Error handling
const getGraphQlErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null => {
  if (!body) {
    return {
      message: "Unknown Error!",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }

  if ("errors" in body) {
    const errors = body?.errors;

    // If there are errors, return join them in 1 string
    const messages = errors?.map((error) => error?.message).join("");
    const code = errors?.[0].extensions?.code;

    return {
      message: messages || JSON.stringify(errors),
      statusCode: code || 500,
    };
  }

  return null;
};

export const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);
  const responseClone = response.clone();
  const body = await responseClone.json();

  const error = getGraphQlErrors(body);
  if (error) {
    throw error;
  }

  return response;
};
