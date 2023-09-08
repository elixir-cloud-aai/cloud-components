/**
 * Import DesingSystem and envoke/register all the components here
 */
import { DesignSystem } from '@microsoft/fast-foundation';
import components from './src/index.js';

// Register all the components
components.forEach((component) => {
  DesignSystem.getOrCreate().withShadowRootMode('open').register(component);
});
