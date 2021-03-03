import { Label } from "./label";
import { Context, CustomFieldsOutput } from "./plugin";

export interface Actor {
  _id: string;
  name: string;
  aliases: string[];
  addedOn: Date;
  bornOn: number | null;
  thumbnail: string | null;
  altThumbnail: string | null;
  hero?: string | null;
  avatar?: string | null;
  favorite: boolean;
  bookmark: number | null;
  rating: number;
  customFields: Record<string, boolean | string | number | string[] | null>;
  description?: string | null;
  nationality?: string | null;
}

export interface FullActorOutput extends CustomFieldsOutput {
  name: string;
  description: string;
  bornOn: number;
  addedOn: number;
  rating: number;
  favorite: boolean;
  bookmark: number;
  nationality: string;
  aliases: string[];
  labels: string[];
  thumbnail: string;
  altThumbnail: string;
  avatar: string;
  hero: string;
}

export type ActorOutput = Partial<FullActorOutput>;

export interface ActorContext extends Context<ActorOutput> {
  actor: Actor;
  actorName: string;
  // Server functions to lazy load extra actor data
  $getLabels: () => Promise<Label[]>;
  $getAverageRating: () => Promise<number>;
}

// Merge the actor's initial data and previous plugins piped data
export async function getMergedData(ctx: ActorContext): Promise<ActorOutput> {
  const { data, actor } = ctx;

  const initialData: ActorOutput = {
    name: actor.name,
    description: actor.description || undefined,
    bornOn: actor.bornOn || undefined,
    addedOn: actor.addedOn.valueOf(),
    rating: actor.rating,
    favorite: actor.favorite,
    bookmark: actor.bookmark || undefined,
    nationality: actor.nationality || undefined,
    aliases: actor.aliases,
    labels: (await ctx.$getLabels()).map((l) => l.name),
    thumbnail: actor.thumbnail || undefined,
    altThumbnail: actor.altThumbnail || undefined,
    avatar: actor.avatar || undefined,
    hero: actor.hero || undefined,
  };

  return { ...initialData, ...data };
}
