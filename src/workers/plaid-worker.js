import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const PLAID_CLIENT_ID = "674b7053d74216001aa5bc85";
const PLAID_SECRET = "f75b0d18a7c808a424beb1e9a411d7";
const PLAID_ENV = PlaidEnvironments.sandbox;

const configuration = new Configuration({
  basePath: PLAID_ENV,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

export default {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === "/create-link-token") {
        const response = await client.linkTokenCreate({
          user: { client_user_id: "user-" + Math.random() },
          client_name: "Chill Bill",
          products: ["transactions"],
          country_codes: ["US"],
          language: "en",
        });

        return new Response(JSON.stringify(response.data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      if (path === "/exchange-public-token") {
        const { public_token } = await request.json();
        const response = await client.itemPublicTokenExchange({ public_token });

        return new Response(JSON.stringify(response.data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      if (path === "/fetch-transactions") {
        const { access_token } = await request.json();
        const response = await client.transactionsGet({
          access_token,
          start_date: "2023-01-01",
          end_date: new Date().toISOString().split("T")[0],
        });

        return new Response(JSON.stringify(response.data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error("Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
