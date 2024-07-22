import { ArtistInterface } from "../models/artist.model";
import { TrackInterface } from "../models/track.model";
import { UserInterface } from "../models/user.model";

type Item = TrackInterface | ArtistInterface;
type ItemType = "tracks" | "artists";

interface CompatibilityDetail {
  user1Name: string;
  user2Name: string;
  compatibilityPercentage: number;
  sharedItems: Item[];
}

export type CompatibilityResult = {
  compatibilityMatrix: CompatibilityDetail[];
  groupCompatibility: number;
};

export type CircleCompatibilityData = {
  tracks: CompatibilityResult;
  artists: CompatibilityResult;
};

export function getCircleCompatibility(
  users: UserInterface[]
): CircleCompatibilityData {
  const userCount = users.length;

  function calculatePairwiseCompatibility(
    user1: UserInterface,
    user2: UserInterface,
    itemType: ItemType
  ): CompatibilityDetail {
    const user1Items = user1[itemType];
    const user2Items = user2[itemType];
    // Nonlinear transformation function to skew the distribution
    function skewedTransformation(x: number): number {
      // Apply a quadratic transformation to skew the values
      // Adjust the constants to fit your desired skewing effect
      const skewFactor = 0.5; // Adjust this factor as needed
      return Math.round(10000 * Math.pow(x / 100, skewFactor)) / 100;
    }

    const sharedItems = user2Items.filter((item) =>
      user1Items.map((user1Item) => user1Item.name).includes(item.name)
    );
    const sharedItemsCount = sharedItems.length;
    const totalUniqueItems =
      user1Items.length + user2Items.length - sharedItemsCount;
    const compatibilityPercentage = skewedTransformation(
      (sharedItemsCount / totalUniqueItems) * 100
    );
    return {
      user1Name: user1.username,
      user2Name: user2.username,
      compatibilityPercentage,
      sharedItems,
    }; // Apply exponential weighting
  }

  function getCompatibilityResult(itemType: ItemType): CompatibilityResult {
    const compatibilityMatrix: CompatibilityDetail[] = [];
    let totalCompatibility = 0;
    let comparisons = 0;

    for (let i = 0; i < userCount; i++) {
      for (let j = i + 1; j < userCount; j++) {
        if (!!!users[i][itemType] || !!!users[j][itemType]) {
          continue;
        }
        const pairwiseCompatibility = calculatePairwiseCompatibility(
          users[i],
          users[j],
          itemType
        );
        compatibilityMatrix.push(pairwiseCompatibility);
        totalCompatibility += pairwiseCompatibility.compatibilityPercentage;
        comparisons++;
      }
    }

    const groupCompatibility =
      Math.round((100 * totalCompatibility) / comparisons) / 100;

    compatibilityMatrix.sort(
      (a, b) => b.compatibilityPercentage - a.compatibilityPercentage
    );

    return {
      compatibilityMatrix,
      groupCompatibility,
    };
  }

  const trackCompatibility = getCompatibilityResult("tracks");
  const artistCompatibility = getCompatibilityResult("artists");

  return {
    tracks: trackCompatibility,
    artists: artistCompatibility,
  };
}
