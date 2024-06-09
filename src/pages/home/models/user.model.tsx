import { ArtistInterface } from "./artist.model";

export interface UserInterface {
  username: string;
  email: string;
  artists: ArtistInterface[];
}
