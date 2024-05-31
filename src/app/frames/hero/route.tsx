/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/src/app/frames/frames";
import { fetchUserSocialCapitalScore } from "@/lib/farcaster";
import { appURL } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

const handler = frames(async (ctx) => {
  try {
    if (!ctx.message?.isValid) {
      throw new Error("Invalid message");
    }

    console.log("user data", ctx.message.requesterUserData);
    const username = ctx.message?.requesterUserData?.username;

    if (!username) {
      throw new Error("Invalid username");
    }

    const userSocialCapitalScore = await fetchUserSocialCapitalScore(username);
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
                  Your Social Capital Stats
                </p>
              </div>
            </div>

            <div tw="flex flex-row w-auto text-white items-center mb-[25px] mt-[30px] items-start justify-start">
              <div tw="flex flex-col mx-auto items-center">
                <p tw="text-[48px]" style={{ fontFamily: "Inter-Bold" }}>
                  Ranking 🏆
                </p>
                <p tw="text-[64px]">
                  {userSocialCapitalScore?.socialCapital?.socialCapitalRank}
                </p>
              </div>
              <div tw="flex flex-col mx-auto items-center">
                <p tw="text-[48px]" style={{ fontFamily: "Inter-Bold" }}>
                  Score 🎯
                </p>
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
        <Button
          action="post"
          key="2"
          target={`/loading?id=${uuidv4()}&requestTimestamp=${Date.now()}&status=start`}
        >
          Calculate Frens
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
        <Button action="post" key="1" target="/hero">
          🔄 Try again
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
