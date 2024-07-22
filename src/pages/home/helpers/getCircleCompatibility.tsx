import { ArtistInterface } from "../models/artist.model";
import { TrackInterface } from "../models/track.model";
import { UserInterface } from "../models/user.model";

type Item = TrackInterface | ArtistInterface;

interface CompatibilityDetail {
  compatibilityPercentage: number;
  sharedItems: Item[];
}

type CompatibilityResult = {
  compatibilityMatrix: { [key: string]: CompatibilityDetail };
  groupCompatibility: number;
};

export function getCircleCompatibility(users: UserInterface[]): {
  trackCompatibility: CompatibilityResult;
  artistCompatibility: CompatibilityResult;
} {
  const userCount = users.length;

  function calculatePairwiseCompatibility(
    user1Items: Item[],
    user2Items: Item[]
  ): CompatibilityDetail {
    // Nonlinear transformation function to skew the distribution
    function skewedTransformation(x: number): number {
      // Apply a quadratic transformation to skew the values
      // Adjust the constants to fit your desired skewing effect
      const skewFactor = 0.5; // Adjust this factor as needed
      return 100 * Math.pow(x / 100, skewFactor);
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
    return { compatibilityPercentage, sharedItems }; // Apply exponential weighting
  }

  function getCompatibilityResult(
    itemType: "tracks" | "artists"
  ): CompatibilityResult {
    const compatibilityMatrix: { [key: string]: CompatibilityDetail } = {};
    let totalCompatibility = 0;
    let comparisons = 0;

    for (let i = 0; i < userCount; i++) {
      for (let j = i + 1; j < userCount; j++) {
        if (!!!users[i][itemType] || !!!users[j][itemType]) {
          continue;
        }
        const user1Items = users[i][itemType];
        const user2Items = users[j][itemType];
        const pairwiseCompatibility = calculatePairwiseCompatibility(
          user1Items,
          user2Items
        );
        compatibilityMatrix[`${users[i].userId}-${users[j].userId}`] =
          pairwiseCompatibility;
        totalCompatibility += pairwiseCompatibility.compatibilityPercentage;
        comparisons++;
      }
    }

    const groupCompatibility = totalCompatibility / comparisons;

    return {
      compatibilityMatrix,
      groupCompatibility,
    };
  }

  const trackCompatibility = getCompatibilityResult("tracks");
  const artistCompatibility = getCompatibilityResult("artists");

  return {
    trackCompatibility,
    artistCompatibility,
  };
}
