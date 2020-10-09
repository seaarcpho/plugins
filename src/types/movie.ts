import { Context } from "./plugin";

export interface Movie {
  _id: string;
  name: string;
  description: string | null;
  addedOn: Date;
  releaseDate: number | null;
  frontCover: string | null;
  backCover: string | null;
  spineCover: string | null;
  favorite: boolean;
  bookmark: number | null;
  rating: number;
  scenes?: string[]; // backwards compatibility
  customFields: Record<string, boolean | string | number | string[] | null>;
  studio: string | null;
}
export interface MovieOutput {
  name: string;
  description: string;
  releaseDate: number;
  frontCover: string;
  backCover: string;
  labels: string[];
}

export interface MovieContext extends Context<MovieOutput> {
  movie: Movie;
  movieName: string;
}
