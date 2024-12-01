import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createLinkToken = async () => {
  const response = await fetch('https://financial-stress-ai.chillbill.workers.dev/create-link-token');
  const data = await response.json();
  return data;
};

export const exchangePublicToken = async (publicToken: string) => {
  const response = await fetch('https://financial-stress-ai.chillbill.workers.dev/exchange-public-token', {
    method: 'POST',
    body: JSON.stringify({ public_token: publicToken }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data;
};

export const fetchTransactions = async (accessToken: string) => {
  const response = await fetch('https://financial-stress-ai.chillbill.workers.dev/fetch-transactions', {
    method: 'POST',
    body: JSON.stringify({
      access_token: accessToken,
      start_date: '2022-01-01', // Update the start date to a broader range
      end_date:'2025-01-01', // Use the current date as the end date
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  console.log('Fetched Transactions:', data); // Log the response for debugging
  return data;
};