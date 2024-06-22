import { Image } from "./image.model";

export interface TrackArtist {
  url: string;
  name: string;
}

export interface TrackInterface {
  url: string;
  name: string;
  popularity: number;
  artists: TrackArtist[];
  images: Image[];
}
