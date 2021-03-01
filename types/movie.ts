import { Actor } from "./movie";
import { Label } from "./label";
import { Scene } from "./scene";
import { Context, CustomFieldsOutput } from "./plugin";

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
export interface FullMovieOutput extends CustomFieldsOutput {
  name: string;
  description: string;
  releaseDate: number;
  addedOn: number;
  rating: number;
  favorite: boolean;
  bookmark: number;
  frontCover: string;
  backCover: string;
  spineCover: string;
  studio: string;
}

export type MovieOutput = Partial<FullMovieOutput>;

export interface MovieContext extends Context<MovieOutput> {
  movie: Movie;
  movieName: string;
  // Server functions to lazy load extra movie data
  $getActors: () => Promise<Actor[]>;
  $getLabels: () => Promise<Label[]>;
  $getScenes: () => Promise<Scene[]>;
  $getAverageRating: () => Promise<number>;
}

// Merge the movie's initial data and previous plugins piped data
export async function getMergedData(ctx: MovieContext): Promise<MovieOutput> {
  const { data, movie } = ctx;

  const initialData: MovieOutput = {
    name: movie.name,
    description: movie.description || undefined,
    releaseDate: movie.releaseDate || undefined,
    addedOn: movie.addedOn.valueOf(),
    rating: movie.rating,
    favorite: movie.favorite,
    bookmark: movie.bookmark || undefined,
    frontCover: movie.frontCover || undefined,
    backCover: movie.backCover || undefined,
    spineCover: movie.spineCover || undefined,
    studio: movie.studio || undefined,
  };

  const mergedData = { ...initialData, ...data };

  return mergedData;
}
