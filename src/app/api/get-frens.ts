// import { fetchQuery, init } from "@airstack/node";
// import { FetchUserSocialCapitalScoreQuery } from "../frames/reveal/airstack-types";
// import { fetchUserSocialCapitalScoreQuery } from "../lib/airstack/queries";

import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log("req.body", req.body);
  res.status(200).json({ message: "Hello from Next.js!" });
}

// export interface QueryFetchUserSocialCapitalScoreResponse {
//   data: FetchUserSocialCapitalScoreQuery | null;
//   error: {
//     message: string;
//   } | null;
// }

// if (!process.env.AIRSTACK_API_KEY) {
//   throw new Error("Missing Airstack API key");
// }
// init(process.env.AIRSTACK_API_KEY);

// const { data: userSCS, error }: QueryFetchUserSocialCapitalScoreResponse =
// await fetchQuery(fetchUserSocialCapitalScoreQuery, {
//   username: "fc_fname:" + ctx.message.requesterUserData?.username,
// });

// if (error) {
// throw new Error(error.message);
// }

// console.log("userSCS", JSON.stringify(userSCS?.Socials?.Social));
