import { Button } from "frames.js/next";
import { appURL } from "@/lib/utils";
import { frames } from "@/src/app/frames/frames";
import { getMutualObject } from "@/lib/kv";

const handleRequest = frames(async (ctx) => {
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  const url = new URL(ctx.request.url);
  const { searchParams } = url;
  const requestId = searchParams.get("id");
  const status = searchParams.get("status");
  if (status === "start") {
    // console.log("user data", ctx.message.requesterUserData);
    const username = ctx.message?.requesterUserData?.username || "";

    const res = await fetch(`${appURL()}/api/mutuals-task`, {
      method: "POST",
      headers: {
        "x-secret": process.env.SECRET!,
      },
      body: JSON.stringify({
        username,
        id: requestId,
      }),
    });

    if (!res.ok) {
      return {
        image: (
          <div tw="relative w-full h-full flex bg-[#6b38c2] text-white">
            <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
              <div tw="flex flex-col p-[40px] mt-[50px] w-auto text-white">
                <h1 tw="mx-auto text-center text-[98px]">Error</h1>
                <p tw="text-center text-[42px]">
                  Something went wrong. Please try again.
                </p>
                <h2 tw="mx-auto text-[68px]">Click on Retry 👇🏼</h2>
              </div>
            </div>
          </div>
        ),
        imageOptions: {
          aspectRatio: "1:1",
        },
        buttons: [
          <Button action="post" key="1" target={`/loading?id=${requestId}`}>
            🔄 Try again
          </Button>,
        ],
      };
    }
  }

  // console.log("console before mutual object");

  const result = await getMutualObject(requestId!);

  // console.log("result", JSON.stringify(result));

  if (result?.status === "error") {
    const requestTimestamp = searchParams.get("requestTimestamp");
    const timeDiff = Date.now() - parseInt(requestTimestamp!);

    // check if more than 30 seconds passed
    if (timeDiff > 1000 * 30) {
      return {
        postUrl: `/loading?id=${requestId}&requestTimestamp=${requestTimestamp}&status=loading`,
        image: `${appURL()}/images/loading-timeout.png`,
        imageOptions: {
          aspectRatio: "1:1",
        },
        buttons: [
          <Button
            action="post"
            key="1"
            target={`/loading?id=${requestId}&requestTimestamp=${requestTimestamp}&status=loading`}
          >
            💬 Show response
          </Button>,
          <Button
            action="post"
            key="1"
            target={`/build?id=${requestId}&restart=true`}
          >
            🔄 Try again
          </Button>,
        ],
      };
    }
    return {
      postUrl: `/results?id=${requestId}`,
      image: `${appURL()}/images/loading.gif`,
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button
          action="post"
          key="1"
          target={`/loading?id=${requestId}&requestTimestamp=${requestTimestamp}&status=loading`}
        >
          💬 Show response
        </Button>,
      ],
    };
  }

  if (result === null || result?.status === "loading") {
    return {
      image: (
        <div tw="relative w-full h-full flex bg-[#6b38c2] text-white">
          <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
            <div tw="flex flex-col p-[40px] mt-[200px] w-auto text-white">
              <h1
                tw="mx-auto text-center text-[98px]"
                style={{ fontFamily: "Inter-Bold" }}
              >
                Loading...
              </h1>
              <p tw="text-center text-[42px] mx-auto">
                (the frame is calculating your mutuals with your potential frens
                👀)
              </p>
            </div>
          </div>
        </div>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button action="post" key="1" target={`/hero`}>
          ↩️ Start over
        </Button>,
        <Button action="post" key="1" target={`/loading?id=${requestId}`}>
          ↩️ Show result
        </Button>,
      ] as any,
    };
  }

  // return {
  //   image: (
  //     <div tw="relative w-full h-full flex bg-[#6b38c2] text-white">
  //       <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
  //         <div tw="flex flex-col p-[40px] mt-[50px] w-auto text-white">
  //           <h1 tw="mx-auto text-center text-[98px]">Success</h1>
  //           <p tw="text-center text-[42px]">
  //             Your mutuals have been calculated.
  //           </p>
  //           <h2 tw="mx-auto text-[68px]">Click on Show Mutuals 👇🏼</h2>
  //         </div>
  //       </div>
  //     </div>
  //   ),
  //   imageOptions: {
  //     aspectRatio: "1:1",
  //   },
  //   buttons: [
  //     <Button
  //       action="post"
  //       key="1"
  //       target={`/loading?id=${requestId}&start=true`}
  //     >
  //       ↩️ Start over
  //     </Button>,
  //     <Button action="post" key="1" target={`/reveal?id=${requestId}`}>
  //       ↩️ Reveal
  //     </Button>,
  //   ] as any,
  // };

  const { frens, mutuals } = result;
  const userName = ctx.message?.requesterUserData?.username;

  return {
    image: (
      <div tw="relative w-full h-full flex bg-[#6b38c2] text-white">
        <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
          <div tw="flex flex-col text-white items-center p-[20px]">
            <div tw="flex flex-col px-[40px] py-[20px] mt-[5px] w-auto text-white text-center">
              <h1
                tw="font-bold text-[68px] mx-auto"
                style={{ fontFamily: "Bricolage-Bold" }}
              >
                Here we go {userName}!
              </h1>
              <p
                tw="font-bold text-[38px]"
                style={{ fontFamily: "Bricolage-Bold" }}
              >
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
                      tw="w-[120px] h-[120px] rounded-full mr-[20px] object-cover my-auto"
                    />
                    <div tw="flex flex-col w-[650px]">
                      <p
                        tw="font-bold text-[54px] my-[2px]"
                        style={{ fontFamily: "Bricolage-Bold" }}
                      >
                        {user?.profileHandle
                          ? user.profileHandle
                          : user.profileName
                          ? user.profileName
                          : "n.a"}
                      </p>
                      <p tw="text-[32px] text-wrap ml-[2px] my-0">
                        {user?.profileBio
                          ? user.profileBio.substring(0, 80) +
                            (user.profileBio.length > 80 ? "..." : "")
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div tw="flex flex-col text-center mr-[15px]">
                    <p tw="my-[2px] mx-auto">Mutuals</p>
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
});

export const GET = handleRequest;
export const POST = handleRequest;
