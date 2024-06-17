import { ArtistInterface } from "./artist.model";

export interface UserInterface {
  username: string;
  userId: string;
  artists: ArtistInterface[];
}
