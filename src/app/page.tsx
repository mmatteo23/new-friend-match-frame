import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
  return {
    title: "New Friend Match",
    description: "A frame for matching with new friends on Farcaster.",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL(
        "/frames",
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      )
    ),
  };
}

export default function Page() {
  return <span>My existing page</span>;
}
