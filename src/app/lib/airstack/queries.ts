export const fetchUserSocialCapitalScoreQuery = /* GraphQL */ `
  query FetchUserSocialCapitalScore($username: Identity!) {
    Socials(
      input: {
        filter: { dappName: { _eq: farcaster }, identity: { _eq: $username } }
        blockchain: ethereum
      }
    ) {
      Social {
        socialCapital {
          socialCapitalScoreRaw
          socialCapitalScore
          socialCapitalRank
        }
        profileImage
        profileHandle
        profileDisplayName
        profileName
        isFarcasterPowerUser
        userId
        identity
        custodyAddress: userAddress
      }
    }
  }
`;

export const fetchUserFriendsBySocialCapitalScoreQuery = /* GraphQL */ `
  query FetchUserFriendsBySocialCapitalScore(
    $scs_gt: Float
    $scs_lt: Float
    $userId: String
    $limit: Int
  ) {
    Socials(
      input: {
        filter: {
          dappName: { _eq: farcaster }
          socialCapitalScore: { _gt: $scs_gt, _lt: $scs_lt }
          userId: { _ne: $userId }
        }
        blockchain: ethereum
        limit: $limit
      }
    ) {
      Social {
        profileName
        fid: userId
        custodyAddress: userAddress
        connectedAddresses {
          address
          blockchain
        }
        socialCapital {
          socialCapitalScore
        }
        identity
        profileBio
        profileImage
        profileHandle
        profileDisplayName
        isFarcasterPowerUser
        followers(input: { filter: { followerProfileId: { _eq: $userId } } }) {
          Follower {
            id
            dappName
            followerProfileId
            followingProfileId
          }
        }
      }
    }
  }
`;

export const fetchUserMutualFriendsQuery = /* GraphQL */ `
  query FetchUserMutualFriends(
    $viewerAddress: Identity
    $frenAddress: Identity
  ) {
    SocialFollowings(
      input: {
        filter: { identity: { _eq: $viewerAddress } }
        blockchain: ALL
        limit: 200
      }
    ) {
      Following {
        followingAddress {
          socialFollowers(
            input: { filter: { identity: { _eq: $frenAddress } }, limit: 200 }
          ) {
            Follower {
              followerAddress {
                socials {
                  fnames
                  profileName
                  profileTokenId
                  profileTokenIdHex
                  userId
                  userAssociatedAddresses
                }
              }
            }
          }
        }
      }
    }
  }
`;
