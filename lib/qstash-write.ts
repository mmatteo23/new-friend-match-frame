import { Client } from "@upstash/qstash";
import { appURL } from "./utils";

const qstashClient = new Client({
  // Add your token to a .env file
  token: process.env.QSTASH_TOKEN!,
});

export async function createNewMutualsTask(id: string, username: string) {
  const result = await qstashClient.publishJSON({
    url: `${appURL()}/api/mutuals-worker`,
    body: {
      id,
      username,
    },
  });
  console.log("Task created:", result);
}
