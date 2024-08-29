import { ArtistInterface } from "../models/artist.model";
import { CircleInfo } from "../models/circleInfo.model";
import {
  ConsolidatedCircle,
  ConsolidatedArtist,
  ConsolidatedTrack,
} from "../models/consolidatedItems.model";
import { TrackInterface } from "../models/track.model";

type Item = ArtistInterface | TrackInterface;
export type AllowedItems = "artists" | "tracks";

type ConsolidatedItem<T> = T & {
  points: number;
  percentagePoints: number;
  weightedPoints: number;
  contributors: string[];
};

function createConsolidatedItem(
  item: Item,
  point: number,
  username: string
): ConsolidatedItem<Item> {
  return {
    ...item,
    points: point,
    percentagePoints: 0, // Placeholder for percentage points
    weightedPoints: 0, // Placeholder for weighted points
    contributors: [username],
  } as ConsolidatedItem<Item>; // Asserting the type to ConsolidatedItem<T>
}

function consolidateTopItemsWithPoints(
  circle: CircleInfo,
  itemType: AllowedItems,
  scaleFactor: number,
  topX: number
): ConsolidatedItem<Item>[] {
  const points: { [name: string]: ConsolidatedItem<Item> } = {};

  circle.users.forEach((user) => {
    if (!!user[itemType]) {
      user[itemType].forEach((item, rank) => {
        const point = user[itemType].length - rank; // Higher rank gets more points
        if (points[item.name]) {
          points[item.name].points += point;
          points[item.name].contributors.push(user.username);
        } else {
          points[item.name] = createConsolidatedItem(
            item,
            point,
            user.username
          );
        }
      });
    }
  });

  // Convert the points object to an array and sort by points in descending order
  const sortedItems = Object.values(points).sort((a, b) => b.points - a.points);

  // Slice the top X items
  const topItems = sortedItems.slice(0, topX);

  // Calculate the total points
  const totalPoints = topItems.reduce((acc, item) => acc + item.points, 0);

  // Calculate percentage of total points for each item
  topItems.forEach((item) => {
    item.percentagePoints = (item.points / totalPoints) * 100;
  });

  // Apply exponential weighting
  const maxRank = topItems.length;
  topItems.forEach((item, index) => {
    const rank = index + 1;
    const exponentialWeight = Math.exp(
      ((maxRank - rank) / maxRank) * scaleFactor
    ); // Exponential function
    item.weightedPoints = item.percentagePoints * exponentialWeight;
  });

  // Normalize weighted points to add up to 100
  const totalWeightedPoints = topItems.reduce(
    (acc, item) => acc + item.weightedPoints,
    0
  );
  topItems.forEach((item) => {
    item.weightedPoints = (item.weightedPoints / totalWeightedPoints) * 100;
  });

  // Sort by weighted points in descending order
  topItems.sort((a, b) => b.weightedPoints - a.weightedPoints);

  return topItems;
}

export function consolidateCircle(
  circle: CircleInfo,
  scaleFactor: number = 1.5,
  topX: number = 10
): ConsolidatedCircle {
  const consolidatedArtists = consolidateTopItemsWithPoints(
    circle,
    "artists",
    scaleFactor,
    topX
  ) as ConsolidatedArtist[];
  const consolidatedTracks = consolidateTopItemsWithPoints(
    circle,
    "tracks",
    scaleFactor,
    topX
  ) as ConsolidatedTrack[];

  console.log("innefecient");

  return {
    artists: consolidatedArtists,
    tracks: consolidatedTracks,
  };
}
