import { ArtistInterface } from "../models/artist.model";
import { CircleInfo } from "../models/circleInfo.model";
import { TrackInterface } from "../models/track.model";

export interface UserObscurity {
  averagePopularity: number;
  username: string;
}

export interface PopularityData {
  averagePopularity: number;
  userPopularityRanking: UserObscurity[];
}

export interface CirclePopularityData {
  artists: PopularityData;
  tracks: PopularityData;
}

const getUserItemPopularityData = (
  item: (TrackInterface | ArtistInterface)[],
  username: string
) => {
  const userObscurity: UserObscurity = {
    averagePopularity: 0,
    username: username,
  };

  if (!!!item || item.length === 0) {
    return userObscurity;
  }

  let totalWeightedPopularity = 0;
  let totalWeight = 0;

  item.forEach((item, index, { length }) => {
    const weight = Math.pow(length + 1 - index, 8); // Squaring the weights
    totalWeightedPopularity += item.popularity * weight;
    totalWeight += weight;
  });
  userObscurity.averagePopularity = totalWeightedPopularity / totalWeight;
  userObscurity.averagePopularity =
    Math.round(userObscurity.averagePopularity * 100) / 100;
  return userObscurity;
};

const sortAndAveragePopularityData = (popularityData: PopularityData) => {
  popularityData.userPopularityRanking =
    popularityData.userPopularityRanking.filter(
      (user) => user.averagePopularity !== 0
    );
  popularityData.averagePopularity =
    popularityData.userPopularityRanking.reduce(
      (acc, user) => acc + user.averagePopularity,
      0
    ) / popularityData.userPopularityRanking.length;

  popularityData.averagePopularity =
    Math.round(popularityData.averagePopularity * 100) / 100;

  popularityData.userPopularityRanking.sort(
    (a, b) => b.averagePopularity - a.averagePopularity
  );
};

export const getCirclePopularityData = (
  circle: CircleInfo
): CirclePopularityData => {
  const artistsPopularity: PopularityData = {
    averagePopularity: 0,
    userPopularityRanking: [],
  };
  const tracksPopularity: PopularityData = {
    averagePopularity: 0,
    userPopularityRanking: [],
  };

  const circlePopularity: CirclePopularityData = {
    tracks: tracksPopularity,
    artists: artistsPopularity,
  };

  if (circle.users.length === 0) {
    return circlePopularity;
  }

  artistsPopularity.userPopularityRanking = circle.users.map((user) =>
    getUserItemPopularityData(user.artists, user.username)
  );
  tracksPopularity.userPopularityRanking = circle.users.map((user) =>
    getUserItemPopularityData(user.tracks, user.username)
  );

  sortAndAveragePopularityData(artistsPopularity);
  sortAndAveragePopularityData(tracksPopularity);

  return circlePopularity;
};
