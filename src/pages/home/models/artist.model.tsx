export interface ArtistImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface ArtistInterface {
  url: string;
  name: string;
  popularity: number;
  genres: string[];
  images: ArtistImage[];
}
