/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { FrameDefinition, JsonValue } from "frames.js/types";
import { frames } from "@/src/app/frames/frames";
import { getMutualObject } from "@/lib/kv";

const handler = frames(async (ctx) => {
  try {
    if (!ctx.message?.isValid) {
      throw new Error("Invalid message");
    }

    // console.log("user data", ctx.message.requesterUserData);
    const userName = ctx.message?.requesterUserData?.username || "";

    const url = new URL(ctx.request.url);
    const { searchParams } = url;
    const requestId = searchParams.get("id");
    const result = await getMutualObject(requestId!);

    const frens = result?.frens;
    const mutuals = result?.mutuals;

    // const buttons = [
    // <Button action="post" key="1" target="/hero">
    //   Back
    // </Button>,
    //   frens ? (
    //     frens.map((fren, index) => (
    //       <Button
    //         action="link"
    //         key={index + 1}
    //         target={`https://warpcast.com/${fren?.profileHandle}`}
    //       >
    //         Fren
    //       </Button>
    //     ))
    //   ) : (
    //     <Button action="link" key="2" target="https://warpcast.com/">
    //       recalculate
    //     </Button>
    //   ),
    // ] as FrameDefinition<JsonValue>["buttons"];

    return {
      image: (
        <div tw="relative w-full h-full flex bg-[#6b38c2] text-white">
          <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
            <div tw="flex flex-col text-white items-center p-[20px]">
              <div tw="flex flex-col px-[40px] py-[20px] mt-[20px] w-auto text-white text-center">
                <h1
                  tw="font-bold text-[68px] mx-auto"
                  style={{ fontFamily: "Inter-Bold" }}
                >
                  Here we go {userName}!
                </h1>
                <p tw="text-[38px]">
                  These are some users in your social capital score range. Hope
                  you can make some new frens!
                </p>
              </div>
            </div>

            <div tw="flex flex-col w-auto text-white mb-[50px] items-start gap-[10px] justify-start">
              {frens && frens.length > 0 ? (
                frens.map((user, index) => (
                  <div
                    key={index}
                    tw="flex ml-[10px] mb-[50px] w-full text-white items-center justify-between"
                  >
                    <div tw="flex">
                      <img
                        src={user?.profileImage ? user.profileImage : ""}
                        tw="w-[120px] h-[120px] rounded-full mr-[20px] my-auto"
                        style={{ objectFit: "cover" }}
                      />
                      <div tw="flex flex-col w-[700px]">
                        <p
                          tw="text-[54px] my-[2px]"
                          style={{ fontFamily: "Inter-Bold" }}
                        >
                          {user?.profileHandle ? user.profileHandle : " "}
                        </p>
                        <p tw="text-[32px] text-pretty ml-[2px] my-0">
                          {user?.profileBio
                            ? user.profileBio
                            : "bio not available"}
                        </p>
                      </div>
                    </div>
                    <div tw="flex flex-col text-center mr-[15px]">
                      <p
                        tw="my-[2px] mx-auto"
                        style={{ fontFamily: "Inter-Bold" }}
                      >
                        Mutuals
                      </p>
                      <p tw="font-bold my-[2px] mx-auto text-[54px]">
                        {mutuals && mutuals[index] ? mutuals[index] : "-"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div tw="flex flex-col mx-auto items-center">
                  <p tw="text-[48px]">No new frens in your range 😢</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" key="1" target="/hero">
          Back
        </Button>,
        frens?.[0] ? (
          <Button
            action="link"
            key={2}
            target={`https://warpcast.com/${frens?.[0]?.profileHandle}`}
          >
            {frens?.[0]?.profileHandle || "Fren 1"}
          </Button>
        ) : undefined,
        frens?.[1] ? (
          <Button
            action="link"
            key={2}
            target={`https://warpcast.com/${frens?.[1]?.profileHandle}`}
          >
            {frens?.[1]?.profileHandle || "Fren 2"}
          </Button>
        ) : undefined,
        frens?.[2] ? (
          <Button
            action="link"
            key={2}
            target={`https://warpcast.com/${frens?.[2]?.profileHandle}`}
          >
            {frens?.[2]?.profileHandle || "Fren 3"}
          </Button>
        ) : undefined,
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
