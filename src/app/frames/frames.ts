/* eslint-disable react/jsx-key */
import { farcasterHubContext } from "frames.js/middleware";
import { imagesWorkerMiddleware } from "frames.js/middleware/images-worker";
import { createFrames } from "frames.js/next";
import {
  appURL,
  DEFAULT_DEBUGGER_HUB_URL,
  FRAMES_BASE_PATH,
} from "@/lib/utils";

export const frames = createFrames({
  basePath: FRAMES_BASE_PATH,
  baseUrl: appURL(),
  middleware: [
    imagesWorkerMiddleware({
      imagesRoute: "/images",
      secret: "MY_VERY_SECRET_SECRET",
    }),
    farcasterHubContext({
      // ...(process.env.NODE_ENV === "production"
      //   ? {
      //       hubHttpUrl: "https://hubs.airstack.xyz",
      //       hubRequestOptions: {
      //         headers: {
      //           "x-airstack-hubs": process.env.AIRSTACK_API_KEY as string,
      //         },
      //       },
      //     }
      //   : {
      //       hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
      //     }),
    }),
  ],
});
