declare module "next/dynamic" {
  import type { ComponentType } from "react";

  type LoaderResult<P> = Promise<{ default: ComponentType<P> } | ComponentType<P>>;

  export default function dynamic<P = unknown>(
    loader: () => LoaderResult<P>,
    options?: { ssr?: boolean },
  ): ComponentType<P>;
}
