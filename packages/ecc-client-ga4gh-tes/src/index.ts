/**
 * Import DesingSystem and envoke/register all the components here
 */
import { DesignSystem } from "@microsoft/fast-foundation";

DesignSystem.getOrCreate().withPrefix("ecc").register();
