import { ArtistInterface } from "./artist.model";
import { TrackInterface } from "./track.model";

export interface UserInterface {
  username: string;
  userId: string;
  artists: ArtistInterface[];
  tracks: TrackInterface[];
  images: string[];
}
