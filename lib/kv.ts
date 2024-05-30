import { kv } from "@vercel/kv";
import { FarcasterUser } from "./farcaster";

type REQUEST_STATUS = "success" | "error" | "loading";

export const storeMutualObject = async (
  frens: FarcasterUser[] | undefined,
  viewer: FarcasterUser | undefined,
  mutuals: number[] | undefined,
  id: number,
  status: REQUEST_STATUS,
  error?: string
) => {
  await kv.set(`request/${id}`, { frens, viewer, mutuals, status, error });
  return id;
};

export const deleteMutualObject = async (id: string) => {
  await kv.del(`request/${id}`);
};

// export const getMutualCalldata = async (id: string, userChoice: number) => {};

export const getMutualObject = async (
  id: string
): Promise<{
  frens: FarcasterUser[];
  viewer: FarcasterUser;
  mutuals: number[];
  status: REQUEST_STATUS;
  error?: string;
} | null> => {
  return await kv.get(`request/${id}`);
};
