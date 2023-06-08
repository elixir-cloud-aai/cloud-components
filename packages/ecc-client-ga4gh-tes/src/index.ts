/**
 * Import DesingSystem and envoke/register all the components here
 */
import { DesignSystem } from "@microsoft/fast-foundation";
import TESGetRuns from "./components/tes-get-runs/index.js";

DesignSystem.getOrCreate().withShadowRootMode("open").register(TESGetRuns);
