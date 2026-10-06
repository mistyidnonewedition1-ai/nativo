"use client";

import { createContext, useContext } from "react";
import type { MeResponse } from "@nativo/shared";

export const MeCtx = createContext<MeResponse | null>(null);
export const useMe = () => useContext(MeCtx);