import { appURL } from "@/lib/utils";
import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
  return {
    title: "New Friend Match",
    description:
      "A frame for matching with new friends on Farcaster by @midenaeth",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(new URL("/frames", appURL())),
  };
}

export default function Page() {
  return <span>My existing page</span>;
}
