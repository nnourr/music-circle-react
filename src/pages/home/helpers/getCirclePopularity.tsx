import { CircleInfo } from "../models/circleInfo.model";

export interface UserObscurity {
  averagePopularity: number;
  username: string;
}

export interface CirclePopularityData {
  averagePopularity: number;
  obscurityRanking: UserObscurity[];
}

export const getCirclePopularityData = (
  circle: CircleInfo
): CirclePopularityData => {
  const circlePopularity: CirclePopularityData = {
    averagePopularity: 0,
    obscurityRanking: [],
  };

  if (circle.users.length === 0) {
    return circlePopularity;
  }

  circle.users.forEach((user) => {
    if (user.artists.length === 0) {
      return;
    }
    const userObscurity: UserObscurity = {
      averagePopularity: 0,
      username: user.username,
    };
    circlePopularity.obscurityRanking.push(userObscurity);

    let totalWeightedPopularity = 0;
    let totalWeight = 0;

    user.artists.forEach((artist, index, { length }) => {
      const weight = Math.pow(length + 1 - index, 8); // Squaring the weights
      totalWeightedPopularity += artist.popularity * weight;
      totalWeight += weight;
    });

    userObscurity.averagePopularity = totalWeightedPopularity / totalWeight;
    userObscurity.averagePopularity =
      Math.round(userObscurity.averagePopularity * 100) / 100;
  });

  circlePopularity.averagePopularity =
    circlePopularity.obscurityRanking.reduce(
      (acc, user) => acc + user.averagePopularity,
      0
    ) / circlePopularity.obscurityRanking.length;

  circlePopularity.averagePopularity =
    Math.round(circlePopularity.averagePopularity * 100) / 100;

  circlePopularity.obscurityRanking.sort(
    (a, b) => a.averagePopularity - b.averagePopularity
  );

  return circlePopularity;
};
