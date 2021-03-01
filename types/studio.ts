import { Label } from "./label";
import { Context, CustomFieldsOutput } from "./plugin";

export interface Studio {
  _id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  addedOn: number;
  favorite: boolean;
  bookmark: number | null;
  parent: string | null;
  aliases?: string[];
  customFields: Record<string, boolean | string | number | string[] | null>;
}

export interface FullStudioOutput extends CustomFieldsOutput {
  name: string;
  description: string;
  addedOn: number;
  favorite: boolean;
  bookmark: number;
  aliases: string[];
  labels: string[];
  parent: string;
  thumbnail: string;
}

export type StudioOutput = Partial<FullStudioOutput>;

export interface StudioContext extends Context<StudioOutput> {
  studio: Studio;
  studioName: string;
  // Server functions to lazy load extra studio data
  $getLabels: () => Promise<Label[]>;
  $getAverageRating: () => Promise<number>;
  $getParents: () => Promise<Studio[]>;
  $getSubStudios: () => Promise<Studio[]>;
}

// Merge the studio's initial data and previous plugins piped data
export async function getMergedData(ctx: StudioContext): Promise<StudioOutput> {
  const { data, studio } = ctx;

  const initialData: StudioOutput = {
    name: studio.name,
    description: studio.description || undefined,
    addedOn: studio.addedOn.valueOf(),
    favorite: studio.favorite,
    bookmark: studio.bookmark || undefined,
    aliases: studio.aliases,
    labels: (await ctx.$getLabels()).map((l) => l.name),
    parent: studio.parent || undefined,
    thumbnail: studio.thumbnail || undefined,
  };

  const mergedData = { ...initialData, ...data };

  return mergedData;
}
