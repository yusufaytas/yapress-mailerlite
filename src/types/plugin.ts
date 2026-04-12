import type { ReactNode } from "react";

export type PluginSlot =
  | "bodyStart"
  | "bodyEnd"
  | "headerStart"
  | "headerEnd"
  | "footerStart"
  | "footerEnd"
  | "beforePost"
  | "afterPost"
  | "popup";

export type PluginContext = {
  post?: unknown;
  page?: unknown;
  [key: string]: unknown;
};

export type PluginComponent = React.ComponentType<PluginContext>;

export interface Plugin {
  name: string;
  version: string;
  description?: string;
  enabled?: boolean;
  order?: number;
  components?: Partial<Record<PluginSlot, PluginComponent[]>>;
}

export type PluginFactory<TConfig> = (config: TConfig) => Plugin;

export type PluginRenderResult = ReactNode;
