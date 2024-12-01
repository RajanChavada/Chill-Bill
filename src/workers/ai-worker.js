import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const PLAID_CLIENT_ID = '674b7053d74216001aa5bc85';
const PLAID_SECRET = 'f75b0d18a7c808a424beb1e9a411d7';
const PLAID_ENV = PlaidEnvironments.sandbox; // Change to PlaidEnvironments.production for production

const configuration = new Configuration({
  basePath: PLAID_ENV,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
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
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const { pathname } = new URL(request.url);

    if (pathname === '/create-link-token') {
      return await createLinkToken();
    } else if (pathname === '/exchange-public-token') {
      const { public_token } = await request.json();
      return await exchangePublicToken(public_token);
    } else if (pathname === '/fetch-transactions') {
      const { access_token } = await request.json();
      return await fetchTransactions(access_token);
    } else if (pathname === '/ai-endpoint') {
      // Existing AI endpoint logic
      const { concern } = await request.json();
      const prompt = `As a financial advisor, analyze this concern: "${concern}"

Please provide:
1. Three specific, actionable tips to address this concern in detail
2. A stress level rating from 1-10 based on the severity of the concern

can you format it not as JSON object, but just as plain bullet points?
`;
      const aiResponse = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable financial advisor. Provide concise, practical advice and assess stress levels accurately."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(aiResponse.response);
      } catch (e) {
        const text = aiResponse.response;
        const tips = text.match(/(?:"[^"]*"|[^,])+/g)
          ?.filter(tip => tip.trim().length > 0)
          ?.slice(0, 3)
          ?.map(tip => tip.trim().replace(/^["'\s]+|["'\s]+$/g, '')) || [];
        const stressLevelMatch = text.match(/\b([1-9]|10)\b/);
        const stressLevel = stressLevelMatch ? parseInt(stressLevelMatch[0]) : 5;

        parsedResponse = {
          tips: tips.length > 0 ? tips : [
            "Break down the problem into smaller, manageable steps",
            "Create a detailed budget to understand your finances",
            "Consider consulting with a financial advisor"
          ],
          stressLevel: stressLevel
        };
      }

      return new Response(JSON.stringify({
        result: parsedResponse
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function createLinkToken() {
  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: 'unique-user-id' },
      client_name: 'Your App Name',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    return new Response(JSON.stringify(response.data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

async function exchangePublicToken(public_token) {
  try {
    const response = await client.itemPublicTokenExchange({ public_token });
    return new Response(JSON.stringify(response.data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

async function fetchTransactions(access_token) {
  try {
    const response = await client.transactionsGet({
      access_token,
      start_date: '2023-01-01', // Update the start date to a broader range
      end_date: new Date().toISOString().split('T')[0], // Use the current date as the end date
    });

    console.log('Fetched Transactions Response:', response.data); // Log the response for debugging

    return new Response(JSON.stringify(response.data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error); // Log the error for debugging
    return handleError(error);
  }
}

function handleError(error) {
  console.error('Plaid error:', error);
  return new Response(JSON.stringify({ error: error.message }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}