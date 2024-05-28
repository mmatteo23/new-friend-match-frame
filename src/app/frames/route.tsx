/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL } from "@/lib/utils";

const handleRequest = frames(async (ctx) => {
  console.log("ctx.message", ctx.message);
  return {
    image: (
      <div tw="flex flex-col text-center">
        <span>Are u ready to find new frens?</span>
        <span>Click on Reveal!</span>
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
  };
});

export const GET = handleRequest;
export const POST = handleRequest;

// return {
// image: (
//   <span>
//     {ctx.pressedButton
//       ? `I clicked ${ctx.searchParams.value}`
//       : `Click on 'Reveal' to see who could be your new friend!`}
//   </span>
// ),
//   image: (
//     <div tw="relative flex flex-col text-center items-center justify-center">
//       <img src={`${appURL()}/images/friends.jpg`} tw="w-full" />
//     </div>
//   ),
//   buttons: [
//     <Button action="post" target={{ query: { value: "reveal" } }}>
//       Reveal
//     </Button>,
//   ],
// };
