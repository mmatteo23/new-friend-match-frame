import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { getFrens, getMutualsFromFrens } from "@/lib/farcaster";
import { storeMutualObject } from "@/lib/kv";

async function handler(req: NextRequest) {
  const body = await req.json();
  // extract data params from the request
  const { username, id } = body;

  try {
    let storeResultInKv = await storeMutualObject(
      undefined,
      undefined,
      undefined,
      id,
      "loading"
    );

    const fetchFrensResponse = await getFrens(username);
    console.log("Frens fetched", fetchFrensResponse);

    if (!fetchFrensResponse.user || !fetchFrensResponse.randomFrens) {
      throw new Error("No user or random frens found");
    }

    let fetchMutualsResponse = await getMutualsFromFrens(
      fetchFrensResponse.randomFrens!,
      fetchFrensResponse.user?.identity ||
        fetchFrensResponse.user?.custodyAddress
    );
    // console.log("MUTUAL FETCHED", fetchMutualsResponse);

    if (!fetchMutualsResponse) {
      throw new Error("No mutuals found");
    }

    storeResultInKv = await storeMutualObject(
      fetchFrensResponse.randomFrens,
      fetchFrensResponse.user,
      fetchMutualsResponse,
      id,
      "success"
    );

    return NextResponse.json({ name: "Mutuals response stored" });
  } catch (error: any) {
    console.error(`Error processing task - [${Date.now()}] - `, error);
    await storeMutualObject(
      undefined,
      undefined,
      [],
      id,
      "error",
      error?.message || "Unknown error"
    );
    return NextResponse.json({ name: "Mutuals response returned an error" });
  }
}

export const POST = verifySignatureAppRouter(handler);
