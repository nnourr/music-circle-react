import { Image } from "./image.model";

export interface ArtistInterface {
  url: string;
  name: string;
  popularity: number;
  genres: string[];
  images: Image[];
}
