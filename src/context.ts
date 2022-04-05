import React from "react";
import type { ContextOptions } from "./types";

export const OptionsContext = React.createContext<ContextOptions>(
  {} as ContextOptions
);
