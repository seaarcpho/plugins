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

export interface ActorOutput extends CustomFieldsOutput {
  name?: string;
  description?: string;
  bornOn?: number;
  thumbnail?: string;
  aliases?: string[];
  labels?: string[];
  altThumbnail?: string;
}

export interface ActorContext extends Context<ActorOutput> {
  actor: Actor;
  actorName: string;
}
