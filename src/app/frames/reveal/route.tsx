/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/src/app/frames/frames";
import { appURL } from "@/lib/utils";
import { init, fetchQuery, fetchQueryWithPagination } from "@airstack/node";
import {
  FetchUserFriendsBySocialCapitalScoreQuery,
  FetchUserMutualFriendsQuery,
  FetchUserSocialCapitalScoreQuery,
} from "../../lib/airstack/types";
import {
  fetchUserFriendsBySocialCapitalScoreQuery,
  fetchUserMutualFriendsQuery,
  fetchUserSocialCapitalScoreQuery,
} from "../../lib/airstack/queries";
import { Erica_One } from "next/font/google";
import { FetchQuery } from "@airstack/node/dist/types/types";

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

export interface QueryFetchUserMutualsResponse {
  data: FetchUserMutualFriendsQuery | null;
  error: {
    message: string;
  } | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  getNextPage: () => Promise<QueryFetchUserMutualsResponse>;
  getPrevPage: () => Promise<QueryFetchUserMutualsResponse>;
}

async function getFrens(userName: string) {
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

  const rangeConstant = userSCS?.Socials?.Social?.[0].socialCapital
    ?.socialCapitalScore
    ? userSCS?.Socials?.Social?.[0].socialCapital?.socialCapitalScore * 0.21
    : 5;

  console.log("rangeConstant", rangeConstant);

  const scs_gt =
    userSCS?.Socials?.Social?.[0].socialCapital?.socialCapitalScore! -
    rangeConstant;
  const scs_lt =
    userSCS?.Socials?.Social?.[0].socialCapital?.socialCapitalScore! +
    rangeConstant;
  const userId = userSCS?.Socials?.Social?.[0].userId;

  console.log("looking for frens in range:", scs_gt, scs_lt);

  const {
    data: frens,
    error: errorFrens,
  }: QueryFetchUserFriendsBySocialCapitalScoreResponse = await fetchQuery(
    fetchUserFriendsBySocialCapitalScoreQuery,
    {
      scs_gt,
      scs_lt,
      userId,
      limit: 200,
    }
  );

  if (errorFrens) {
    throw new Error(errorFrens.message);
  }

  console.log("already frens in your range:", frens?.Socials?.Social?.length);

  // extract from frens.Socials.Social all the object that have followers.Follower === null
  // this is the list of potential frens
  const potentialFrens = frens?.Socials?.Social?.filter((fren) => {
    return fren?.followers?.Follower === null;
  });

  console.log("potential new frens in your range:", potentialFrens?.length);

  // get 3 potential frens at random
  const randomFrens = potentialFrens
    ?.sort(() => 0.5 - Math.random())
    .slice(0, 3);
  console.log("randomFrens", JSON.stringify(randomFrens));

  return {
    user: userSCS?.Socials?.Social?.[0],
    randomFrens,
  };
}

async function getMutuals(viewerAddress: string, frenAddress: string) {
  let mutuals = [];
  const {
    data: firstData,
    error: firstError,
    hasNextPage: firstHasNextPage,
    getNextPage: firstGetNextPage,
  } = await fetchQueryWithPagination(fetchUserMutualFriendsQuery, {
    viewerAddress,
    frenAddress,
  });

  if (firstError) {
    console.error("Error in getMutuals 1", firstError);
    throw new Error(firstError.message);
  }

  mutuals =
    (
      firstData as FetchUserMutualFriendsQuery
    )?.SocialFollowings?.Following?.filter((mutual) => {
      return mutual?.followingAddress?.socialFollowers?.Follower !== null;
    }) || [];
  let data: FetchUserMutualFriendsQuery | null = firstData;
  let hasNextPage: boolean | undefined = firstHasNextPage;
  let getNextPage: (() => Promise<FetchQuery | null>) | undefined =
    firstGetNextPage;

  while (hasNextPage) {
    if (!getNextPage) {
      throw new Error("getNextPage is not defined");
    }
    const nextResult: any = await getNextPage();

    if (nextResult?.error) {
      console.error("Error in getMutuals 2", nextResult.error);
      throw new Error(nextResult.error.message);
    }

    data = nextResult?.data;
    hasNextPage = nextResult?.hasNextPage;
    getNextPage = nextResult?.getNextPage;

    mutuals = mutuals.concat(
      (
        data as FetchUserMutualFriendsQuery
      )?.SocialFollowings?.Following?.filter((mutual) => {
        return mutual?.followingAddress?.socialFollowers?.Follower !== null;
      }) || []
    );
  }

  console.log("mutuals counter", mutuals.length);

  return mutuals.length;
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

    const { user: userProfile, randomFrens: frens } = await getFrens(userName);
    // const frens = [
    //   {
    //     profileName: "jessepollak",
    //     fid: "99",
    //     custodyAddress: "0x4ce34af3378a00c640125e4dbf4c9e64dff4c93b",
    //     connectedAddresses: [
    //       {
    //         address: "0x849151d7d0bf1f34b70d5cad5149d28cc2308bf1",
    //         blockchain: "ethereum",
    //       },
    //       {
    //         address: "0x6e0d9c6dd8a08509bb625caa35dc61a991406f62",
    //         blockchain: "ethereum",
    //       },
    //       {
    //         address: "0xe73f9c181b571cac2bf3173634d04a9921b7ffcf",
    //         blockchain: "ethereum",
    //       },
    //     ],
    //     socialCapital: {
    //       socialCapitalScore: 387.27176464242,
    //     },
    //     profileImage: "https://i.imgur.com/rOy7TtZ.gif",
    //     profileHandle: "jessepollak",
    //     profileDisplayName: "Jesse Pollak 🔵",
    //     isFarcasterPowerUser: true,
    //     followers: {
    //       Follower: [
    //         {
    //           id: "d4ed8d30d8d8e72d9b40e98ad2778f0109542baea7a5a4f24552298eb641c590",
    //           dappName: "farcaster",
    //           followerProfileId: "3",
    //           followingProfileId: "99",
    //         },
    //       ],
    //     },
    //     profileBio: "@base contributor #001; onchain cities w/ OAK & city3",
    //     profileUrl: "",
    //   },
    //   {
    //     profileName: "greg",
    //     fid: "347",
    //     custodyAddress: "0xb4f195e9a982c2ba58988cb2132557378e9e6b08",
    //     connectedAddresses: [
    //       {
    //         address: "0x179a862703a4adfb29896552df9e307980d19285",
    //         blockchain: "ethereum",
    //       },
    //     ],
    //     socialCapital: {
    //       socialCapitalScore: 321.18747256589995,
    //     },
    //     profileImage:
    //       "https://i.seadn.io/gae/YsASemS2qwPJK2yI9fmN8HX1-DeIDy9EQxX4KsRk9rkniwn9A7xUyMu_vKR75Oxrs8QAKfIjqdmf6Aw9A9fsehJHWSz2LiNpnV_TPQ?w=500&auto=format",
    //     profileHandle: "greg",
    //     profileDisplayName: "Greg",
    //     isFarcasterPowerUser: true,
    //     followers: {
    //       Follower: [
    //         {
    //           id: "305258775ab6b21abec1dcfbb5d561405a4fdd17f3854627917c713a2bc83621",
    //           dappName: "farcaster",
    //           followerProfileId: "3",
    //           followingProfileId: "347",
    //         },
    //       ],
    //     },
    //     profileBio:
    //       "I like baking and building apps on web3 protocols. DevRel @ ENS Labs. gregskril.com",
    //     profileUrl: "",
    //   },
    //   {
    //     profileName: "jacob",
    //     fid: "8",
    //     custodyAddress: "0xc6e3004b0e54a91da8d87ace80b6abc64d23e33f",
    //     connectedAddresses: [
    //       {
    //         address: "0x17cd072cbd45031efc21da538c783e0ed3b25dcc",
    //         blockchain: "ethereum",
    //       },
    //     ],
    //     socialCapital: {
    //       socialCapitalScore: 322.244783127945,
    //     },
    //     profileImage: "https://i.imgur.com/tt8uLVd.jpg",
    //     profileHandle: "jacob",
    //     profileDisplayName: "jacob",
    //     isFarcasterPowerUser: true,
    //     followers: {
    //       Follower: [
    //         {
    //           id: "3c2fd6205af977ece8b97112f265f81c30073914e89e900c20986d5759ab2eda",
    //           dappName: "farcaster",
    //           followerProfileId: "3",
    //           followingProfileId: "8",
    //         },
    //       ],
    //     },
    //     profileBio: "Working on /zora, zora.co.\n +++???!!!",
    //     profileUrl: "",
    //   },
    // ];

    const mutuals: number[] = [];
    if (frens) {
      frens.forEach(async (fren) => {
        console.log(
          "mutuals between",
          userProfile?.identity || userProfile?.custodyAddress,
          fren.identity || fren.custodyAddress
        );
        console.log("fren: ", fren);
        mutuals.push(
          await getMutuals(
            userProfile?.identity || userProfile?.custodyAddress,
            fren.identity || fren.custodyAddress
          )
        );
      });
    }

    return {
      image: (
        <div tw="relative w-full h-full flex bg-[#6b38c2] text-white">
          <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
            <div tw="flex flex-col text-white items-center p-[20px]">
              <div tw="flex flex-col px-[40px] py-[20px] mt-[20px] w-auto text-white text-center">
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
                      <div tw="flex flex-col w-[700px]">
                        <p
                          tw="font-bold text-[54px] my-[2px]"
                          style={{ fontFamily: "Bricolage-Bold" }}
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
                      <p tw="my-[2px] mx-auto">Mutuals</p>
                      <p tw="font-bold my-[2px] mx-auto text-[54px]">
                        {mutuals[index] ? mutuals[index] : "0"}
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
        <Button action="link" key="2" target="https://warpcast.com/">
          {frens && frens[0].profileName ? frens[0].profileName : ""}
        </Button>,
        <Button action="link" key="2" target="https://warpcast.com/">
          {frens && frens[1].profileName ? frens[1].profileName : ""}
        </Button>,
        <Button action="link" key="2" target="https://warpcast.com/">
          {frens && frens[2].profileName ? frens[2].profileName : ""}
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
