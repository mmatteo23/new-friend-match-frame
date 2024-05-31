/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <div tw="relative w-full h-full flex bg-[#6b38c2] text-white">
        <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
          <div tw="flex flex-col p-[40px] mt-[50px] w-auto text-white">
            <h1
              tw="mx-auto text-center text-[98px]"
              style={{ fontFamily: "Inter-Bold" }}
            >
              Are u ready to find new frens?
            </h1>
            <p tw="text-center text-[42px]">
              Find 3 users that are in your same Social Capital Score range.
            </p>
            <h2 tw="mx-auto text-[68px]" style={{ fontFamily: "Inter-Bold" }}>
              Click on Start 👇🏼
            </h2>
          </div>
        </div>
      </div>
    ),
    // image: (
    //   <div tw="relative flex flex-col text-center items-center justify-center">
    //     <img src={`${appURL()}/images/friends.jpg`} tw="w-full" />
    //   </div>
    // ),
    buttons: [
      <Button action="post" key="1" target="/hero">
        Start
      </Button>,
    ],
    imageOptions: {
      aspectRatio: "1:1",
    },
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
