import { init, fetchQuery, fetchQueryWithPagination } from "@airstack/node";
import {
  FetchUserFriendsBySocialCapitalScoreQuery,
  FetchUserMutualFriendsQuery,
  FetchUserSocialCapitalScoreQuery,
} from "./airstack/types";
import {
  fetchUserFriendsBySocialCapitalScoreQuery,
  fetchUserMutualFriendsQuery,
  fetchUserSocialCapitalScoreQuery,
} from "./airstack/queries";
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

export type FarcasterUser = {
  profileName: string | null;
  identity: any;
  profileBio?: string | null;
  profileImage: string | null;
  profileHandle: string | null;
  profileDisplayName: string | null;
  isFarcasterPowerUser: boolean | null;
  custodyAddress: string | null;
  followers?: {} | null;
};

if (!process.env.AIRSTACK_API_KEY) {
  throw new Error("Missing Airstack API key");
}
init(process.env.AIRSTACK_API_KEY);

export async function fetchUserSocialCapitalScore(username: string) {
  const {
    data: userSCS,
    error: errorUserSCS,
  }: QueryFetchUserSocialCapitalScoreResponse = await fetchQuery(
    fetchUserSocialCapitalScoreQuery,
    {
      username: "fc_fname:" + username,
    }
  );

  if (errorUserSCS) {
    throw new Error(errorUserSCS.message);
  }
  console.log("userSCS", JSON.stringify(userSCS?.Socials?.Social));
  return userSCS?.Socials?.Social?.[0];
}

export async function getFrens(username: string) {
  const {
    data: userSCS,
    error: errorUserSCS,
  }: QueryFetchUserSocialCapitalScoreResponse = await fetchQuery(
    fetchUserSocialCapitalScoreQuery,
    {
      username: "fc_fname:" + username,
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
  // console.log("randomFrens", JSON.stringify(randomFrens));

  return {
    user: userSCS?.Socials?.Social?.[0],
    randomFrens,
  };
}

export async function getMutuals(viewerAddress: string, frenAddress: string) {
  let mutuals = [];
  try {
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
        console.error("Error in getMutuals [pagination]", nextResult.error);
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
  } catch (error) {
    console.error("Error in getMutuals", error);
  }
  return mutuals.length;
}

export async function getMutualsFromFrens(
  frens: FarcasterUser[],
  viewerIdentityOrAddress: string
) {
  const mutuals: number[] = [];
  try {
    if (frens) {
      for (let i = 0; i < frens.length; i++) {
        console.log(
          "mutuals between",
          viewerIdentityOrAddress,
          frens[i].identity || frens[i].custodyAddress
        );
        const mutual = await getMutuals(
          viewerIdentityOrAddress,
          frens[i].identity || frens[i].custodyAddress
        );
        console.log("mutual calculated for " + frens[i].profileHandle, mutual);
        mutuals.push(mutual);
      }
      return mutuals;
    }
  } catch (error) {
    console.error("Error in getMutualsFromFrens", error);
    // throw error;
  }
  return JSON.parse(JSON.stringify(mutuals));
}
