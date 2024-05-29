/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/src/app/frames/frames";
import { init, fetchQuery } from "@airstack/node";
import {
  FetchUserFriendsBySocialCapitalScoreQuery,
  FetchUserSocialCapitalScoreQuery,
} from "../../lib/airstack/types";
import { fetchUserSocialCapitalScoreQuery } from "../../lib/airstack/queries";

export interface QueryFetchUserSocialCapitalScoreResponse {
  data: FetchUserSocialCapitalScoreQuery | null;
  error: {
    message: string;
  } | null;
}

export interface QueryFetchUserFriendsBySocialCapitalScoreResponse {
  data: FetchUserFriendsBySocialCapitalScoreQuery | null;
  error: {
    message: string;
  } | null;
}

async function getUserSocialCapitalScore(userName: string) {
  const {
    data: userSCS,
    error: errorUserSCS,
  }: QueryFetchUserSocialCapitalScoreResponse = await fetchQuery(
    fetchUserSocialCapitalScoreQuery,
    {
      username: "fc_fname:" + userName,
    }
  );

  if (errorUserSCS) {
    throw new Error(errorUserSCS.message);
  }

  console.log("userSCS", JSON.stringify(userSCS?.Socials?.Social));

  return userSCS?.Socials?.Social?.[0];
}

const handler = frames(async (ctx) => {
  try {
    if (!process.env.AIRSTACK_API_KEY) {
      throw new Error("Missing Airstack API key");
    }
    init(process.env.AIRSTACK_API_KEY);

    if (!ctx.message?.isValid) {
      throw new Error("Invalid message");
    }

    console.log("user data", ctx.message.requesterUserData);
    const userName = ctx.message?.requesterUserData?.username || "";

    const userSocialCapitalScore = await getUserSocialCapitalScore(userName);
    // const userSocialCapitalScore = {
    //   socialCapital: {
    //     socialCapitalScoreRaw: "4306806.000000000000075558",
    //     socialCapitalScore: 0.00004306806,
    //     socialCapitalRank: 134798,
    //   },
    //   profileImage: "https://i.imgur.com/96rdcWp.jpg",
    //   profileHandle: "midenaeth",
    //   profileDisplayName: "fraye from the past",
    //   profileName: "midenaeth",
    //   isFarcasterPowerUser: false,
    //   userId: "262800",
    // };

    if (!userSocialCapitalScore) {
      throw new Error("User not found");
    }

    return {
      image: (
        <div tw="relative w-full h-full flex bg-[#6b38c2] text-white">
          <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
            <div tw="flex flex-col text-white items-center p-[20px]">
              <div tw="flex p-[40px] mt-[60px] w-auto text-white">
                <img
                  src={userSocialCapitalScore.profileImage || undefined}
                  tw="w-[120px] h-[120px] rounded-full mr-[20px] object-cover my-auto"
                />
                <p
                  tw="font-bold text-[78px]"
                  style={{ fontFamily: "Bricolage-Bold" }}
                >
                  {userSocialCapitalScore.profileName}
                </p>
              </div>
              <div tw="flex px-[20px] bg-white text-[#6b38c2] w-auto rounded-full px-[40px] mt-[86px]">
                <p
                  tw="font-bold text-[48px]"
                  style={{ fontFamily: "Bricolage-Bold" }}
                >
                  your social capital stats
                </p>
              </div>
            </div>

            <div tw="flex flex-row w-auto text-white items-center mb-[25px] mt-[30px] items-start justify-start">
              <div tw="flex flex-col mx-auto items-center">
                <p tw="text-[48px] font-bold">Ranking 🏆</p>
                <p tw="text-[64px]">
                  {userSocialCapitalScore?.socialCapital?.socialCapitalRank}
                </p>
              </div>
              <div tw="flex flex-col mx-auto items-center">
                <p tw="text-[48px] font-bold">Score 🎯</p>
                <p tw="text-[64px]">
                  {userSocialCapitalScore?.socialCapital?.socialCapitalScore}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" key="1" target="/">
          Back
        </Button>,
        <Button action="post" key="2" target="/reveal">
          Reveal
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      },
    };
  } catch (error) {
    console.error("Error in reveal frame", error);
    return {
      image: <span>Whooops an error occurred!</span>,
      buttons: [
        <Button
          action="link"
          key="1"
          target="https://passport.talentprotocol.com/signin"
        >
          Create Passport
        </Button>,
        <Button
          action="link"
          key="2"
          target="https://www.notion.so/talentprotocol/Scholarships-EthCC-Take-Off-How-To-Apply-Guide-ec06928c69aa49699649256690d4b781?pvs=4"
        >
          Learn More
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      },
    };
  }
});

export const GET = handler;
export const POST = handler;
