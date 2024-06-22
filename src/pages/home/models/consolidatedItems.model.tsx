import { ArtistInterface } from "./artist.model";
import { TrackInterface } from "./track.model";

export interface ConsolidatedCircle {
  artists: ConsolidatedArtist[];
  tracks: ConsolidatedTrack[];
}

export interface ConsolidatedArtist extends ArtistInterface {
  points: number;
  percentagePoints: number;
  weightedPoints: number;
  contributors: string[];
}

export interface ConsolidatedTrack extends TrackInterface {
  points: number;
  percentagePoints: number;
  weightedPoints: number;
  contributors: string[];
}
