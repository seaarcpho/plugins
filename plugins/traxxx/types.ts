import { StudioContext } from "../../types/studio";

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface StudioSettings {
  /**
   * If a studio name is both a channel and a network, whether to use the channel
   * or the network for the data returned
   */
  channelPriority: boolean;
  /**
   * If a studio name is both a channel and a network, if the returned name
   * should add the have the type as a suffix
   */
  uniqueNames: boolean;
  /**
   * Suffix to add to the studio name, when `channelPriority: true && uniqueNames: true`.
   * Warning: will not automatically add a space between the name and this suffix
   */
  channelSuffix: string;
  /**
   * Suffix to add to the studio name, when `channelPriority: false && uniqueNames: true`.
   * Warning: will not automatically add a space between the name and this suffix
   */
  networkSuffix: string;
}

export interface MyStudioArgs {
  dry: boolean;
  studios: StudioSettings;
}

export interface MyStudioContext extends StudioContext {
  args?: DeepPartial<MyStudioArgs>;
}

export interface MyValidatedStudioContext extends StudioContext {
  args: MyStudioArgs;
}
