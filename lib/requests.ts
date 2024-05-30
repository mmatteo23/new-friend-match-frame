import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

type UserType = {
  profileImage: string | null;
  profileHandle: string | null;
  profileDisplayName: string | null;
  profileName: string | null;
  isFarcasterPowerUser: boolean | null;
  userId: string | null;
  identity: any | null;
  custodyAddress: any | null;
  socialCapital: {
    socialCapitalScoreRaw: string | null;
    socialCapitalScore: number | null;
    socialCapitalRank: number | null;
  } | null;
};

export const storeRequest = async (user: UserType) => {
  const requestId = uuidv4();
  console.log(`[storeRequest] - requestId: ${requestId}`);
  await kv.set(requestId, user);
  return requestId;
};

export const getRequest = async (requestId: string) => {
  console.log(`[getRequest] - requestId: ${requestId}`);
  const user = await kv.get<UserType>(requestId);
  return user;
};
