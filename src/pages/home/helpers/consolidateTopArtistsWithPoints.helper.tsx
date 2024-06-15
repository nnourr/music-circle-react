import { ArtistInterface } from "../models/artist.model";
import { CircleInfo } from "../models/circleInfo.model";

export interface ConsolidatedArtist extends ArtistInterface {
  points: number;
  percentagePoints: number;
  weightedPoints: number;
  contributors: string[];
  url: string;
}

export function consolidateTopArtistsWithPoints(
  circle: CircleInfo,
  scaleFactor: number = 1.5,
  topX: number = 10
): ConsolidatedArtist[] {
  const points: { [artist: string]: ConsolidatedArtist } = {};
  const users = circle.users;
  // Assign points based on the rank of each artist in each user's list
  users.forEach((user) => {
    user.artists.forEach((artist, rank) => {
      const point = user.artists.length - rank; // Higher rank gets more points
      if (points[artist.name]) {
        points[artist.name].points += point;
        points[artist.name].contributors.push(user.username);
      } else {
        points[artist.name] = {
          name: artist.name,
          points: point,
          percentagePoints: 0, // Placeholder for percentage points
          weightedPoints: 0, // Placeholder for weighted points
          contributors: [user.username],
          url: artist.url,
          popularity: artist.popularity,
          genres: artist.genres,
          images: artist.images,
        };
      }
    });
  });

  // Convert the points object to an array and sort by points in descending order
  const sortedArtists = Object.values(points).sort(
    (a, b) => b.points - a.points
  );

  // Slice the top 10 artists
  const topArtists = sortedArtists.slice(0, topX);
  // Calculate the total points
  const totalPoints = Object.values(topArtists).reduce(
    (acc, artist) => acc + artist.points,
    0
  );

  // Calculate percentage of total points for each artist
  Object.values(topArtists).forEach((artist) => {
    artist.percentagePoints = (artist.points / totalPoints) * 100;
  });

  // Apply exponential weighting
  const maxRank = topArtists.length;
  topArtists.forEach((artist, index) => {
    const rank = index + 1;
    const exponentialWeight = Math.exp(
      ((maxRank - rank) / maxRank) * scaleFactor
    ); // Exponential function
    artist.weightedPoints = artist.percentagePoints * exponentialWeight;
  });

  // Normalize weighted points to add up to 100
  const totalWeightedPoints = topArtists.reduce(
    (acc, artist) => acc + artist.weightedPoints,
    0
  );
  topArtists.forEach((artist) => {
    artist.weightedPoints = (artist.weightedPoints / totalWeightedPoints) * 100;
  });

  // Sort by weighted points in descending order
  topArtists.sort((a, b) => b.weightedPoints - a.weightedPoints);

  return topArtists;
}
