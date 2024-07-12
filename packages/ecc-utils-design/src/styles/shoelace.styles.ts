import { css } from "lit";

const sholelaceLightStyles = css`
  :root,
  :host,
  .sl-theme-light {
    color-scheme: light;

    --sl-color-gray-50: hsl(0 0% 97.5%);
    --sl-color-gray-100: hsl(240 4.8% 95.9%);
    --sl-color-gray-200: hsl(240 5.9% 90%);
    --sl-color-gray-300: hsl(240 4.9% 83.9%);
    --sl-color-gray-400: hsl(240 5% 64.9%);
    --sl-color-gray-500: hsl(240 3.8% 46.1%);
    --sl-color-gray-600: hsl(240 5.2% 33.9%);
    --sl-color-gray-700: hsl(240 5.3% 26.1%);
    --sl-color-gray-800: hsl(240 3.7% 15.9%);
    --sl-color-gray-900: hsl(240 5.9% 10%);
    --sl-color-gray-950: hsl(240 7.3% 8%);

    --sl-color-red-50: hsl(0 85.7% 97.3%);
    --sl-color-red-100: hsl(0 93.3% 94.1%);
    --sl-color-red-200: hsl(0 96.3% 89.4%);
    --sl-color-red-300: hsl(0 93.5% 81.8%);
    --sl-color-red-400: hsl(0 90.6% 70.8%);
    --sl-color-red-500: hsl(0 84.2% 60.2%);
    --sl-color-red-600: hsl(0 72.2% 50.6%);
    --sl-color-red-700: hsl(0 73.7% 41.8%);
    --sl-color-red-800: hsl(0 70% 35.3%);
    --sl-color-red-900: hsl(0 62.8% 30.6%);
    --sl-color-red-950: hsl(0 60% 19.6%);

    --sl-color-orange-50: hsl(33.3 100% 96.5%);
    --sl-color-orange-100: hsl(34.3 100% 91.8%);
    --sl-color-orange-200: hsl(32.1 97.7% 83.1%);
    --sl-color-orange-300: hsl(30.7 97.2% 72.4%);
    --sl-color-orange-400: hsl(27 96% 61%);
    --sl-color-orange-500: hsl(24.6 95% 53.1%);
    --sl-color-orange-600: hsl(20.5 90.2% 48.2%);
    --sl-color-orange-700: hsl(17.5 88.3% 40.4%);
    --sl-color-orange-800: hsl(15 79.1% 33.7%);
    --sl-color-orange-900: hsl(15.3 74.6% 27.8%);
    --sl-color-orange-950: hsl(15.2 69.1% 19%);

    --sl-color-amber-50: hsl(48 100% 96.1%);
    --sl-color-amber-100: hsl(48 96.5% 88.8%);
    --sl-color-amber-200: hsl(48 96.6% 76.7%);
    --sl-color-amber-300: hsl(45.9 96.7% 64.5%);
    --sl-color-amber-400: hsl(43.3 96.4% 56.3%);
    --sl-color-amber-500: hsl(37.7 92.1% 50.2%);
    --sl-color-amber-600: hsl(32.1 94.6% 43.7%);
    --sl-color-amber-700: hsl(26 90.5% 37.1%);
    --sl-color-amber-800: hsl(22.7 82.5% 31.4%);
    --sl-color-amber-900: hsl(21.7 77.8% 26.5%);
    --sl-color-amber-950: hsl(22.9 74.1% 16.7%);

    --sl-color-yellow-50: hsl(54.5 91.7% 95.3%);
    --sl-color-yellow-100: hsl(54.9 96.7% 88%);
    --sl-color-yellow-200: hsl(52.8 98.3% 76.9%);
    --sl-color-yellow-300: hsl(50.4 97.8% 63.5%);
    --sl-color-yellow-400: hsl(47.9 95.8% 53.1%);
    --sl-color-yellow-500: hsl(45.4 93.4% 47.5%);
    --sl-color-yellow-600: hsl(40.6 96.1% 40.4%);
    --sl-color-yellow-700: hsl(35.5 91.7% 32.9%);
    --sl-color-yellow-800: hsl(31.8 81% 28.8%);
    --sl-color-yellow-900: hsl(28.4 72.5% 25.7%);
    --sl-color-yellow-950: hsl(33.1 69% 13.9%);

    --sl-color-lime-50: hsl(78.3 92% 95.1%);
    --sl-color-lime-100: hsl(79.6 89.1% 89.2%);
    --sl-color-lime-200: hsl(80.9 88.5% 79.6%);
    --sl-color-lime-300: hsl(82 84.5% 67.1%);
    --sl-color-lime-400: hsl(82.7 78% 55.5%);
    --sl-color-lime-500: hsl(83.7 80.5% 44.3%);
    --sl-color-lime-600: hsl(84.8 85.2% 34.5%);
    --sl-color-lime-700: hsl(85.9 78.4% 27.3%);
    --sl-color-lime-800: hsl(86.3 69% 22.7%);
    --sl-color-lime-900: hsl(87.6 61.2% 20.2%);
    --sl-color-lime-950: hsl(86.5 60.6% 13.9%);

    --sl-color-green-50: hsl(138.5 76.5% 96.7%);
    --sl-color-green-100: hsl(140.6 84.2% 92.5%);
    --sl-color-green-200: hsl(141 78.9% 85.1%);
    --sl-color-green-300: hsl(141.7 76.6% 73.1%);
    --sl-color-green-400: hsl(141.9 69.2% 58%);
    --sl-color-green-500: hsl(142.1 70.6% 45.3%);
    --sl-color-green-600: hsl(142.1 76.2% 36.3%);
    --sl-color-green-700: hsl(142.4 71.8% 29.2%);
    --sl-color-green-800: hsl(142.8 64.2% 24.1%);
    --sl-color-green-900: hsl(143.8 61.2% 20.2%);
    --sl-color-green-950: hsl(144.3 60.7% 12%);

    --sl-color-emerald-50: hsl(151.8 81% 95.9%);
    --sl-color-emerald-100: hsl(149.3 80.4% 90%);
    --sl-color-emerald-200: hsl(152.4 76% 80.4%);
    --sl-color-emerald-300: hsl(156.2 71.6% 66.9%);
    --sl-color-emerald-400: hsl(158.1 64.4% 51.6%);
    --sl-color-emerald-500: hsl(160.1 84.1% 39.4%);
    --sl-color-emerald-600: hsl(161.4 93.5% 30.4%);
    --sl-color-emerald-700: hsl(162.9 93.5% 24.3%);
    --sl-color-emerald-800: hsl(163.1 88.1% 19.8%);
    --sl-color-emerald-900: hsl(164.2 85.7% 16.5%);
    --sl-color-emerald-950: hsl(164.3 87.5% 9.4%);

    --sl-color-teal-50: hsl(166.2 76.5% 96.7%);
    --sl-color-teal-100: hsl(167.2 85.5% 89.2%);
    --sl-color-teal-200: hsl(168.4 83.8% 78.2%);
    --sl-color-teal-300: hsl(170.6 76.9% 64.3%);
    --sl-color-teal-400: hsl(172.5 66% 50.4%);
    --sl-color-teal-500: hsl(173.4 80.4% 40%);
    --sl-color-teal-600: hsl(174.7 83.9% 31.6%);
    --sl-color-teal-700: hsl(175.3 77.4% 26.1%);
    --sl-color-teal-800: hsl(176.1 69.4% 21.8%);
    --sl-color-teal-900: hsl(175.9 60.8% 19%);
    --sl-color-teal-950: hsl(176.5 58.6% 11.4%);

    --sl-color-cyan-50: hsl(183.2 100% 96.3%);
    --sl-color-cyan-100: hsl(185.1 95.9% 90.4%);
    --sl-color-cyan-200: hsl(186.2 93.5% 81.8%);
    --sl-color-cyan-300: hsl(187 92.4% 69%);
    --sl-color-cyan-400: hsl(187.9 85.7% 53.3%);
    --sl-color-cyan-500: hsl(188.7 94.5% 42.7%);
    --sl-color-cyan-600: hsl(191.6 91.4% 36.5%);
    --sl-color-cyan-700: hsl(192.9 82.3% 31%);
    --sl-color-cyan-800: hsl(194.4 69.6% 27.1%);
    --sl-color-cyan-900: hsl(196.4 63.6% 23.7%);
    --sl-color-cyan-950: hsl(196.8 61% 16.1%);

    --sl-color-sky-50: hsl(204 100% 97.1%);
    --sl-color-sky-100: hsl(204 93.8% 93.7%);
    --sl-color-sky-200: hsl(200.6 94.4% 86.1%);
    --sl-color-sky-300: hsl(199.4 95.5% 73.9%);
    --sl-color-sky-400: hsl(198.4 93.2% 59.6%);
    --sl-color-sky-500: hsl(198.6 88.7% 48.4%);
    --sl-color-sky-600: hsl(200.4 98% 39.4%);
    --sl-color-sky-700: hsl(201.3 96.3% 32.2%);
    --sl-color-sky-800: hsl(201 90% 27.5%);
    --sl-color-sky-900: hsl(202 80.3% 23.9%);
    --sl-color-sky-950: hsl(202.3 73.8% 16.5%);

    --sl-color-blue-50: hsl(213.8 100% 96.9%);
    --sl-color-blue-100: hsl(214.3 94.6% 92.7%);
    --sl-color-blue-200: hsl(213.3 96.9% 87.3%);
    --sl-color-blue-300: hsl(211.7 96.4% 78.4%);
    --sl-color-blue-400: hsl(213.1 93.9% 67.8%);
    --sl-color-blue-500: hsl(217.2 91.2% 59.8%);
    --sl-color-blue-600: hsl(221.2 83.2% 53.3%);
    --sl-color-blue-700: hsl(224.3 76.3% 48%);
    --sl-color-blue-800: hsl(225.9 70.7% 40.2%);
    --sl-color-blue-900: hsl(224.4 64.3% 32.9%);
    --sl-color-blue-950: hsl(226.2 55.3% 18.4%);

    --sl-color-indigo-50: hsl(225.9 100% 96.7%);
    --sl-color-indigo-100: hsl(226.5 100% 93.9%);
    --sl-color-indigo-200: hsl(228 96.5% 88.8%);
    --sl-color-indigo-300: hsl(229.7 93.5% 81.8%);
    --sl-color-indigo-400: hsl(234.5 89.5% 73.9%);
    --sl-color-indigo-500: hsl(238.7 83.5% 66.7%);
    --sl-color-indigo-600: hsl(243.4 75.4% 58.6%);
    --sl-color-indigo-700: hsl(244.5 57.9% 50.6%);
    --sl-color-indigo-800: hsl(243.7 54.5% 41.4%);
    --sl-color-indigo-900: hsl(242.2 47.4% 34.3%);
    --sl-color-indigo-950: hsl(243.5 43.6% 22.9%);

    --sl-color-violet-50: hsl(250 100% 97.6%);
    --sl-color-violet-100: hsl(251.4 91.3% 95.5%);
    --sl-color-violet-200: hsl(250.5 95.2% 91.8%);
    --sl-color-violet-300: hsl(252.5 94.7% 85.1%);
    --sl-color-violet-400: hsl(255.1 91.7% 76.3%);
    --sl-color-violet-500: hsl(258.3 89.5% 66.3%);
    --sl-color-violet-600: hsl(262.1 83.3% 57.8%);
    --sl-color-violet-700: hsl(263.4 70% 50.4%);
    --sl-color-violet-800: hsl(263.4 69.3% 42.2%);
    --sl-color-violet-900: hsl(263.5 67.4% 34.9%);
    --sl-color-violet-950: hsl(265.1 61.5% 21.4%);

    --sl-color-purple-50: hsl(270 100% 98%);
    --sl-color-purple-100: hsl(268.7 100% 95.5%);
    --sl-color-purple-200: hsl(268.6 100% 91.8%);
    --sl-color-purple-300: hsl(269.2 97.4% 85.1%);
    --sl-color-purple-400: hsl(270 95.2% 75.3%);
    --sl-color-purple-500: hsl(270.7 91% 65.1%);
    --sl-color-purple-600: hsl(271.5 81.3% 55.9%);
    --sl-color-purple-700: hsl(272.1 71.7% 47.1%);
    --sl-color-purple-800: hsl(272.9 67.2% 39.4%);
    --sl-color-purple-900: hsl(273.6 65.6% 32%);
    --sl-color-purple-950: hsl(276 59.5% 16.5%);

    --sl-color-fuchsia-50: hsl(289.1 100% 97.8%);
    --sl-color-fuchsia-100: hsl(287 100% 95.5%);
    --sl-color-fuchsia-200: hsl(288.3 95.8% 90.6%);
    --sl-color-fuchsia-300: hsl(291.1 93.1% 82.9%);
    --sl-color-fuchsia-400: hsl(292 91.4% 72.5%);
    --sl-color-fuchsia-500: hsl(292.2 84.1% 60.6%);
    --sl-color-fuchsia-600: hsl(293.4 69.5% 48.8%);
    --sl-color-fuchsia-700: hsl(294.7 72.4% 39.8%);
    --sl-color-fuchsia-800: hsl(295.4 70.2% 32.9%);
    --sl-color-fuchsia-900: hsl(296.7 63.6% 28%);
    --sl-color-fuchsia-950: hsl(297.1 56.8% 14.5%);

    --sl-color-pink-50: hsl(327.3 73.3% 97.1%);
    --sl-color-pink-100: hsl(325.7 77.8% 94.7%);
    --sl-color-pink-200: hsl(325.9 84.6% 89.8%);
    --sl-color-pink-300: hsl(327.4 87.1% 81.8%);
    --sl-color-pink-400: hsl(328.6 85.5% 70.2%);
    --sl-color-pink-500: hsl(330.4 81.2% 60.4%);
    --sl-color-pink-600: hsl(333.3 71.4% 50.6%);
    --sl-color-pink-700: hsl(335.1 77.6% 42%);
    --sl-color-pink-800: hsl(335.8 74.4% 35.3%);
    --sl-color-pink-900: hsl(335.9 69% 30.4%);
    --sl-color-pink-950: hsl(336.2 65.4% 15.9%);

    --sl-color-rose-50: hsl(355.7 100% 97.3%);
    --sl-color-rose-100: hsl(355.6 100% 94.7%);
    --sl-color-rose-200: hsl(352.7 96.1% 90%);
    --sl-color-rose-300: hsl(352.6 95.7% 81.8%);
    --sl-color-rose-400: hsl(351.3 94.5% 71.4%);
    --sl-color-rose-500: hsl(349.7 89.2% 60.2%);
    --sl-color-rose-600: hsl(346.8 77.2% 49.8%);
    --sl-color-rose-700: hsl(345.3 82.7% 40.8%);
    --sl-color-rose-800: hsl(343.4 79.7% 34.7%);
    --sl-color-rose-900: hsl(341.5 75.5% 30.4%);
    --sl-color-rose-950: hsl(341.3 70.1% 17.1%);

    --sl-color-primary-50: var(--sl-color-sky-50);
    --sl-color-primary-100: var(--sl-color-sky-100);
    --sl-color-primary-200: var(--sl-color-sky-200);
    --sl-color-primary-300: var(--sl-color-sky-300);
    --sl-color-primary-400: var(--sl-color-sky-400);
    --sl-color-primary-500: var(--sl-color-sky-500);
    --sl-color-primary-600: var(--sl-color-sky-600);
    --sl-color-primary-700: var(--sl-color-sky-700);
    --sl-color-primary-800: var(--sl-color-sky-800);
    --sl-color-primary-900: var(--sl-color-sky-900);
    --sl-color-primary-950: var(--sl-color-sky-950);

    --sl-color-success-50: var(--sl-color-green-50);
    --sl-color-success-100: var(--sl-color-green-100);
    --sl-color-success-200: var(--sl-color-green-200);
    --sl-color-success-300: var(--sl-color-green-300);
    --sl-color-success-400: var(--sl-color-green-400);
    --sl-color-success-500: var(--sl-color-green-500);
    --sl-color-success-600: var(--sl-color-green-600);
    --sl-color-success-700: var(--sl-color-green-700);
    --sl-color-success-800: var(--sl-color-green-800);
    --sl-color-success-900: var(--sl-color-green-900);
    --sl-color-success-950: var(--sl-color-green-950);

    --sl-color-warning-50: var(--sl-color-amber-50);
    --sl-color-warning-100: var(--sl-color-amber-100);
    --sl-color-warning-200: var(--sl-color-amber-200);
    --sl-color-warning-300: var(--sl-color-amber-300);
    --sl-color-warning-400: var(--sl-color-amber-400);
    --sl-color-warning-500: var(--sl-color-amber-500);
    --sl-color-warning-600: var(--sl-color-amber-600);
    --sl-color-warning-700: var(--sl-color-amber-700);
    --sl-color-warning-800: var(--sl-color-amber-800);
    --sl-color-warning-900: var(--sl-color-amber-900);
    --sl-color-warning-950: var(--sl-color-amber-950);

    --sl-color-danger-50: var(--sl-color-red-50);
    --sl-color-danger-100: var(--sl-color-red-100);
    --sl-color-danger-200: var(--sl-color-red-200);
    --sl-color-danger-300: var(--sl-color-red-300);
    --sl-color-danger-400: var(--sl-color-red-400);
    --sl-color-danger-500: var(--sl-color-red-500);
    --sl-color-danger-600: var(--sl-color-red-600);
    --sl-color-danger-700: var(--sl-color-red-700);
    --sl-color-danger-800: var(--sl-color-red-800);
    --sl-color-danger-900: var(--sl-color-red-900);
    --sl-color-danger-950: var(--sl-color-red-950);

    --sl-color-neutral-50: var(--sl-color-gray-50);
    --sl-color-neutral-100: var(--sl-color-gray-100);
    --sl-color-neutral-200: var(--sl-color-gray-200);
    --sl-color-neutral-300: var(--sl-color-gray-300);
    --sl-color-neutral-400: var(--sl-color-gray-400);
    --sl-color-neutral-500: var(--sl-color-gray-500);
    --sl-color-neutral-600: var(--sl-color-gray-600);
    --sl-color-neutral-700: var(--sl-color-gray-700);
    --sl-color-neutral-800: var(--sl-color-gray-800);
    --sl-color-neutral-900: var(--sl-color-gray-900);
    --sl-color-neutral-950: var(--sl-color-gray-950);

    --sl-color-neutral-0: hsl(0, 0%, 100%);
    --sl-color-neutral-1000: hsl(0, 0%, 0%);

    --sl-border-radius-small: 0.1875rem;
    --sl-border-radius-medium: 0.25rem;
    --sl-border-radius-large: 0.5rem;
    --sl-border-radius-x-large: 1rem;

    --sl-border-radius-circle: 50%;
    --sl-border-radius-pill: 9999px;

    --sl-shadow-x-small: 0 1px 2px hsl(240 3.8% 46.1% / 6%);
    --sl-shadow-small: 0 1px 2px hsl(240 3.8% 46.1% / 12%);
    --sl-shadow-medium: 0 2px 4px hsl(240 3.8% 46.1% / 12%);
    --sl-shadow-large: 0 2px 8px hsl(240 3.8% 46.1% / 12%);
    --sl-shadow-x-large: 0 4px 16px hsl(240 3.8% 46.1% / 12%);

    --sl-spacing-3x-small: 0.125rem;
    --sl-spacing-2x-small: 0.25rem;
    --sl-spacing-x-small: 0.5rem;
    --sl-spacing-small: 0.75rem;
    --sl-spacing-medium: 1rem;
    --sl-spacing-large: 1.25rem;
    --sl-spacing-x-large: 1.75rem;
    --sl-spacing-2x-large: 2.25rem;
    --sl-spacing-3x-large: 3rem;
    --sl-spacing-4x-large: 4.5rem;

    --sl-transition-x-slow: 1000ms;
    --sl-transition-slow: 500ms;
    --sl-transition-medium: 250ms;
    --sl-transition-fast: 150ms;
    --sl-transition-x-fast: 50ms;

    --sl-font-mono: SFMono-Regular, Consolas, "Liberation Mono", Menlo,
      monospace;
    --sl-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    --sl-font-serif: Georgia, "Times New Roman", serif;

    --sl-font-size-2x-small: 0.625rem;
    --sl-font-size-x-small: 0.75rem;
    --sl-font-size-small: 0.875rem;
    --sl-font-size-medium: 1rem;
    --sl-font-size-large: 1.25rem;
    --sl-font-size-x-large: 1.5rem;
    --sl-font-size-2x-large: 2.25rem;
    --sl-font-size-3x-large: 3rem;
    --sl-font-size-4x-large: 4.5rem;

    --sl-font-weight-light: 300;
    --sl-font-weight-normal: 400;
    --sl-font-weight-semibold: 500;
    --sl-font-weight-bold: 700;

    --sl-letter-spacing-denser: -0.03em;
    --sl-letter-spacing-dense: -0.015em;
    --sl-letter-spacing-normal: normal;
    --sl-letter-spacing-loose: 0.075em;
    --sl-letter-spacing-looser: 0.15em;

    --sl-line-height-denser: 1;
    --sl-line-height-dense: 1.4;
    --sl-line-height-normal: 1.8;
    --sl-line-height-loose: 2.2;
    --sl-line-height-looser: 2.6;

    --sl-focus-ring-color: var(--sl-color-primary-600);
    --sl-focus-ring-style: solid;
    --sl-focus-ring-width: 3px;
    --sl-focus-ring: var(--sl-focus-ring-style) var(--sl-focus-ring-width)
      var(--sl-focus-ring-color);
    --sl-focus-ring-offset: 1px;

    --sl-button-font-size-small: var(--sl-font-size-x-small);
    --sl-button-font-size-medium: var(--sl-font-size-small);
    --sl-button-font-size-large: var(--sl-font-size-medium);

    --sl-input-height-small: 1.875rem;
    --sl-input-height-medium: 2.5rem;
    --sl-input-height-large: 3.125rem;

    --sl-input-background-color: var(--sl-color-neutral-0);
    --sl-input-background-color-hover: var(--sl-input-background-color);
    --sl-input-background-color-focus: var(--sl-input-background-color);
    --sl-input-background-color-disabled: var(--sl-color-neutral-100);
    --sl-input-border-color: var(--sl-color-neutral-300);
    --sl-input-border-color-hover: var(--sl-color-neutral-400);
    --sl-input-border-color-focus: var(--sl-color-primary-500);
    --sl-input-border-color-disabled: var(--sl-color-neutral-300);
    --sl-input-border-width: 1px;
    --sl-input-required-content: "*";
    --sl-input-required-content-offset: -2px;
    --sl-input-required-content-color: var(--sl-input-label-color);

    --sl-input-border-radius-small: var(--sl-border-radius-medium);
    --sl-input-border-radius-medium: var(--sl-border-radius-medium);
    --sl-input-border-radius-large: var(--sl-border-radius-medium);

    --sl-input-font-family: var(--sl-font-sans);
    --sl-input-font-weight: var(--sl-font-weight-normal);
    --sl-input-font-size-small: var(--sl-font-size-small);
    --sl-input-font-size-medium: var(--sl-font-size-medium);
    --sl-input-font-size-large: var(--sl-font-size-large);
    --sl-input-letter-spacing: var(--sl-letter-spacing-normal);

    --sl-input-color: var(--sl-color-neutral-700);
    --sl-input-color-hover: var(--sl-color-neutral-700);
    --sl-input-color-focus: var(--sl-color-neutral-700);
    --sl-input-color-disabled: var(--sl-color-neutral-900);
    --sl-input-icon-color: var(--sl-color-neutral-500);
    --sl-input-icon-color-hover: var(--sl-color-neutral-600);
    --sl-input-icon-color-focus: var(--sl-color-neutral-600);
    --sl-input-placeholder-color: var(--sl-color-neutral-500);
    --sl-input-placeholder-color-disabled: var(--sl-color-neutral-600);
    --sl-input-spacing-small: var(--sl-spacing-small);
    --sl-input-spacing-medium: var(--sl-spacing-medium);
    --sl-input-spacing-large: var(--sl-spacing-large);

    --sl-input-focus-ring-color: hsl(198.6 88.7% 48.4% / 40%);
    --sl-input-focus-ring-offset: 0;

    --sl-input-filled-background-color: var(--sl-color-neutral-100);
    --sl-input-filled-background-color-hover: var(--sl-color-neutral-100);
    --sl-input-filled-background-color-focus: var(--sl-color-neutral-100);
    --sl-input-filled-background-color-disabled: var(--sl-color-neutral-100);
    --sl-input-filled-color: var(--sl-color-neutral-800);
    --sl-input-filled-color-hover: var(--sl-color-neutral-800);
    --sl-input-filled-color-focus: var(--sl-color-neutral-700);
    --sl-input-filled-color-disabled: var(--sl-color-neutral-800);

    --sl-input-label-font-size-small: var(--sl-font-size-small);
    --sl-input-label-font-size-medium: var(--sl-font-size-medium);
    --sl-input-label-font-size-large: var(--sl-font-size-large);
    --sl-input-label-color: inherit;

    --sl-input-help-text-font-size-small: var(--sl-font-size-x-small);
    --sl-input-help-text-font-size-medium: var(--sl-font-size-small);
    --sl-input-help-text-font-size-large: var(--sl-font-size-medium);
    --sl-input-help-text-color: var(--sl-color-neutral-500);

    --sl-toggle-size-small: 0.875rem;
    --sl-toggle-size-medium: 1.125rem;
    --sl-toggle-size-large: 1.375rem;

    --sl-overlay-background-color: hsl(240 3.8% 46.1% / 33%);

    --sl-panel-background-color: var(--sl-color-neutral-0);
    --sl-panel-border-color: var(--sl-color-neutral-200);
    --sl-panel-border-width: 1px;

    --sl-tooltip-border-radius: var(--sl-border-radius-medium);
    --sl-tooltip-background-color: var(--sl-color-neutral-800);
    --sl-tooltip-color: var(--sl-color-neutral-0);
    --sl-tooltip-font-family: var(--sl-font-sans);
    --sl-tooltip-font-weight: var(--sl-font-weight-normal);
    --sl-tooltip-font-size: var(--sl-font-size-small);
    --sl-tooltip-line-height: var(--sl-line-height-dense);
    --sl-tooltip-padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-small);
    --sl-tooltip-arrow-size: 6px;

    --sl-z-index-drawer: 700;
    --sl-z-index-dialog: 800;
    --sl-z-index-dropdown: 900;
    --sl-z-index-toast: 950;
    --sl-z-index-tooltip: 1000;
  }

  .sl-scroll-lock {
    padding-right: var(--sl-scroll-lock-size) !important;
    overflow: hidden !important;
  }

  .sl-toast-stack {
    position: fixed;
    top: 0;
    inset-inline-end: 0;
    z-index: var(--sl-z-index-toast);
    width: 28rem;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
  }

  .sl-toast-stack sl-alert {
    margin: var(--sl-spacing-medium);
  }

  .sl-toast-stack sl-alert::part(base) {
    box-shadow: var(--sl-shadow-large);
  }
`;

const sholelaceDarkStyles = css`
  :host,
  .sl-theme-dark {
    color-scheme: dark;

    --sl-color-gray-50: hsl(240 5.1% 15%);
    --sl-color-gray-100: hsl(240 5.7% 18.2%);
    --sl-color-gray-200: hsl(240 4.6% 22%);
    --sl-color-gray-300: hsl(240 5% 27.6%);
    --sl-color-gray-400: hsl(240 5% 35.5%);
    --sl-color-gray-500: hsl(240 3.7% 44%);
    --sl-color-gray-600: hsl(240 5.3% 58%);
    --sl-color-gray-700: hsl(240 5.6% 73%);
    --sl-color-gray-800: hsl(240 7.3% 84%);
    --sl-color-gray-900: hsl(240 9.1% 91.8%);
    --sl-color-gray-950: hsl(0 0% 95%);

    --sl-color-red-50: hsl(0 56% 23.9%);
    --sl-color-red-100: hsl(0.6 60% 33.9%);
    --sl-color-red-200: hsl(0.9 67.2% 37.1%);
    --sl-color-red-300: hsl(1.1 71.3% 43.7%);
    --sl-color-red-400: hsl(1 76% 52.5%);
    --sl-color-red-500: hsl(0.7 89.6% 57.2%);
    --sl-color-red-600: hsl(0 98.6% 67.9%);
    --sl-color-red-700: hsl(0 100% 72.3%);
    --sl-color-red-800: hsl(0 100% 85.6%);
    --sl-color-red-900: hsl(0 100% 90.3%);
    --sl-color-red-950: hsl(0 100% 95.9%);

    --sl-color-orange-50: hsl(15 64.2% 23.3%);
    --sl-color-orange-100: hsl(15.1 70.9% 31.1%);
    --sl-color-orange-200: hsl(15.3 75.7% 35.5%);
    --sl-color-orange-300: hsl(17.1 83.5% 42.7%);
    --sl-color-orange-400: hsl(20.1 88% 50.8%);
    --sl-color-orange-500: hsl(24.3 100% 50.5%);
    --sl-color-orange-600: hsl(27.2 100% 57.7%);
    --sl-color-orange-700: hsl(31.3 100% 68.7%);
    --sl-color-orange-800: hsl(33.8 100% 79.3%);
    --sl-color-orange-900: hsl(38.9 100% 87.7%);
    --sl-color-orange-950: hsl(46.2 100% 95%);

    --sl-color-amber-50: hsl(21.9 66.3% 21.1%);
    --sl-color-amber-100: hsl(21.5 73.6% 29.7%);
    --sl-color-amber-200: hsl(22.3 77.6% 33.3%);
    --sl-color-amber-300: hsl(25.4 84.2% 39.6%);
    --sl-color-amber-400: hsl(31.4 87.4% 46.7%);
    --sl-color-amber-500: hsl(37 96.6% 48.3%);
    --sl-color-amber-600: hsl(43.3 100% 53.4%);
    --sl-color-amber-700: hsl(46.5 100% 61.1%);
    --sl-color-amber-800: hsl(49.3 100% 73%);
    --sl-color-amber-900: hsl(51.8 100% 85%);
    --sl-color-amber-950: hsl(60 100% 94.6%);

    --sl-color-yellow-50: hsl(32.5 60% 18.2%);
    --sl-color-yellow-100: hsl(28.1 68.6% 29%);
    --sl-color-yellow-200: hsl(31.3 75.8% 30.8%);
    --sl-color-yellow-300: hsl(34.7 84.4% 35.3%);
    --sl-color-yellow-400: hsl(40.1 87.3% 43.3%);
    --sl-color-yellow-500: hsl(44.7 88% 46%);
    --sl-color-yellow-600: hsl(47.7 100% 50.9%);
    --sl-color-yellow-700: hsl(51.3 100% 59.9%);
    --sl-color-yellow-800: hsl(54.6 100% 73%);
    --sl-color-yellow-900: hsl(58.9 100% 84.2%);
    --sl-color-yellow-950: hsl(60 100% 94%);

    --sl-color-lime-50: hsl(86.5 54.4% 18%);
    --sl-color-lime-100: hsl(87.6 56.8% 23.3%);
    --sl-color-lime-200: hsl(85.8 63.2% 24.5%);
    --sl-color-lime-300: hsl(86.1 72% 29.4%);
    --sl-color-lime-400: hsl(85.5 76.8% 37.3%);
    --sl-color-lime-500: hsl(84.3 74.2% 42.1%);
    --sl-color-lime-600: hsl(82.8 81.5% 52.6%);
    --sl-color-lime-700: hsl(82 89.9% 64%);
    --sl-color-lime-800: hsl(80.9 97.9% 76.6%);
    --sl-color-lime-900: hsl(77.9 100% 85.8%);
    --sl-color-lime-950: hsl(69.5 100% 93.8%);

    --sl-color-green-50: hsl(144.3 53.6% 16%);
    --sl-color-green-100: hsl(143.2 55.4% 23.5%);
    --sl-color-green-200: hsl(141.5 58.2% 26.3%);
    --sl-color-green-300: hsl(140.8 64.2% 31.8%);
    --sl-color-green-400: hsl(140.3 68% 39.2%);
    --sl-color-green-500: hsl(141.1 64.9% 43%);
    --sl-color-green-600: hsl(141.6 72.4% 55.2%);
    --sl-color-green-700: hsl(141.7 82.7% 70.1%);
    --sl-color-green-800: hsl(141 90.9% 82.1%);
    --sl-color-green-900: hsl(142 100% 89.1%);
    --sl-color-green-950: hsl(144 100% 95.5%);

    --sl-color-emerald-50: hsl(164.3 75% 13.5%);
    --sl-color-emerald-100: hsl(163.5 72.6% 20.1%);
    --sl-color-emerald-200: hsl(162.1 73.7% 22.4%);
    --sl-color-emerald-300: hsl(161.3 77.3% 27.6%);
    --sl-color-emerald-400: hsl(159.6 77.1% 34.3%);
    --sl-color-emerald-500: hsl(159.1 73.5% 37.9%);
    --sl-color-emerald-600: hsl(157.8 66.8% 48.9%);
    --sl-color-emerald-700: hsl(156.2 76.1% 63.8%);
    --sl-color-emerald-800: hsl(152.4 84.4% 77.4%);
    --sl-color-emerald-900: hsl(149.3 100% 87%);
    --sl-color-emerald-950: hsl(158.6 100% 94.8%);

    --sl-color-teal-50: hsl(176.5 51.5% 15.4%);
    --sl-color-teal-100: hsl(175.9 54.7% 22.3%);
    --sl-color-teal-200: hsl(175.9 60.7% 23.9%);
    --sl-color-teal-300: hsl(174.5 67.3% 28.8%);
    --sl-color-teal-400: hsl(174.4 71.9% 34.9%);
    --sl-color-teal-500: hsl(173.1 71% 38.3%);
    --sl-color-teal-600: hsl(172.3 68.2% 48.1%);
    --sl-color-teal-700: hsl(170.5 81.3% 61.5%);
    --sl-color-teal-800: hsl(168.4 92.1% 75.2%);
    --sl-color-teal-900: hsl(168.3 100% 86%);
    --sl-color-teal-950: hsl(180 100% 95.5%);

    --sl-color-cyan-50: hsl(197.1 53.8% 20.3%);
    --sl-color-cyan-100: hsl(196.8 57.3% 27.2%);
    --sl-color-cyan-200: hsl(195.3 62.7% 29.4%);
    --sl-color-cyan-300: hsl(193.5 71.3% 34.1%);
    --sl-color-cyan-400: hsl(192.5 76.8% 40.6%);
    --sl-color-cyan-500: hsl(189.4 78.6% 42.6%);
    --sl-color-cyan-600: hsl(188.2 89.1% 51.7%);
    --sl-color-cyan-700: hsl(187 98.6% 66.2%);
    --sl-color-cyan-800: hsl(184.9 100% 78.3%);
    --sl-color-cyan-900: hsl(180 100% 86.6%);
    --sl-color-cyan-950: hsl(180 100% 94.8%);

    --sl-color-sky-50: hsl(203 63.8% 20.9%);
    --sl-color-sky-100: hsl(203.4 70.4% 28%);
    --sl-color-sky-200: hsl(202.7 75.8% 30.8%);
    --sl-color-sky-300: hsl(203.1 80.4% 36.1%);
    --sl-color-sky-400: hsl(202.1 80.5% 44.3%);
    --sl-color-sky-500: hsl(199.7 85.9% 47.7%);
    --sl-color-sky-600: hsl(198.7 97.9% 57.2%);
    --sl-color-sky-700: hsl(198.7 100% 70.5%);
    --sl-color-sky-800: hsl(198.8 100% 82.5%);
    --sl-color-sky-900: hsl(198.5 100% 89.9%);
    --sl-color-sky-950: hsl(186 100% 95.5%);

    --sl-color-blue-50: hsl(227.1 49.5% 22.7%);
    --sl-color-blue-100: hsl(225.8 58.9% 36.8%);
    --sl-color-blue-200: hsl(227.7 64.4% 42.9%);
    --sl-color-blue-300: hsl(226.1 72.7% 51.2%);
    --sl-color-blue-400: hsl(222.6 86.5% 56.3%);
    --sl-color-blue-500: hsl(217.8 95.8% 57.4%);
    --sl-color-blue-600: hsl(213.3 100% 65%);
    --sl-color-blue-700: hsl(210.9 100% 74.8%);
    --sl-color-blue-800: hsl(211.5 100% 83.4%);
    --sl-color-blue-900: hsl(211 100% 88.9%);
    --sl-color-blue-950: hsl(201.8 100% 95.3%);

    --sl-color-indigo-50: hsl(243.5 40.8% 27%);
    --sl-color-indigo-100: hsl(242.9 45.7% 37.6%);
    --sl-color-indigo-200: hsl(244.7 52.7% 43.1%);
    --sl-color-indigo-300: hsl(245.3 60.5% 52.4%);
    --sl-color-indigo-400: hsl(244.1 79.2% 60.4%);
    --sl-color-indigo-500: hsl(239.6 88.7% 63.8%);
    --sl-color-indigo-600: hsl(234.5 96.7% 70.9%);
    --sl-color-indigo-700: hsl(229.4 100% 78.3%);
    --sl-color-indigo-800: hsl(227.1 100% 85%);
    --sl-color-indigo-900: hsl(223.8 100% 89.9%);
    --sl-color-indigo-950: hsl(220 100% 95.1%);

    --sl-color-violet-50: hsl(265.1 57.3% 25.4%);
    --sl-color-violet-100: hsl(263.5 63.8% 39.4%);
    --sl-color-violet-200: hsl(263.4 66.2% 44.1%);
    --sl-color-violet-300: hsl(263.7 72.8% 52.4%);
    --sl-color-violet-400: hsl(262.5 87.3% 59.8%);
    --sl-color-violet-500: hsl(258.3 95.1% 63.2%);
    --sl-color-violet-600: hsl(255.1 100% 67.2%);
    --sl-color-violet-700: hsl(253 100% 81.5%);
    --sl-color-violet-800: hsl(251.7 100% 87.9%);
    --sl-color-violet-900: hsl(254.1 100% 91.7%);
    --sl-color-violet-950: hsl(257.1 100% 96.1%);

    --sl-color-purple-50: hsl(276 54.3% 20.5%);
    --sl-color-purple-100: hsl(273.6 61.8% 35.4%);
    --sl-color-purple-200: hsl(272.9 64% 41.4%);
    --sl-color-purple-300: hsl(271.9 68.1% 49.2%);
    --sl-color-purple-400: hsl(271.5 85.1% 57.8%);
    --sl-color-purple-500: hsl(270.7 96.4% 62.1%);
    --sl-color-purple-600: hsl(270.5 100% 71.9%);
    --sl-color-purple-700: hsl(270.9 100% 81.3%);
    --sl-color-purple-800: hsl(272.4 100% 87.7%);
    --sl-color-purple-900: hsl(276.7 100% 91.5%);
    --sl-color-purple-950: hsl(300 100% 96.5%);

    --sl-color-fuchsia-50: hsl(297.1 51.2% 18.6%);
    --sl-color-fuchsia-100: hsl(296.7 59.5% 31.5%);
    --sl-color-fuchsia-200: hsl(295.4 65.4% 35.1%);
    --sl-color-fuchsia-300: hsl(294.6 67.4% 42.2%);
    --sl-color-fuchsia-400: hsl(293.3 68.7% 51.2%);
    --sl-color-fuchsia-500: hsl(292.1 88.4% 57.7%);
    --sl-color-fuchsia-600: hsl(292 98.5% 59.5%);
    --sl-color-fuchsia-700: hsl(292.4 100% 79.5%);
    --sl-color-fuchsia-800: hsl(292.9 100% 86.8%);
    --sl-color-fuchsia-900: hsl(300 100% 91.5%);
    --sl-color-fuchsia-950: hsl(300 100% 96.3%);

    --sl-color-pink-50: hsl(336.2 59.6% 20%);
    --sl-color-pink-100: hsl(336.8 63.9% 34%);
    --sl-color-pink-200: hsl(336.8 68.7% 37.6%);
    --sl-color-pink-300: hsl(336.1 71.8% 44.5%);
    --sl-color-pink-400: hsl(333.9 74.9% 53.1%);
    --sl-color-pink-500: hsl(330.7 86.3% 57.7%);
    --sl-color-pink-600: hsl(328.6 91.5% 67.2%);
    --sl-color-pink-700: hsl(327.4 97.6% 78.7%);
    --sl-color-pink-800: hsl(325.1 100% 86.6%);
    --sl-color-pink-900: hsl(322.1 100% 91.3%);
    --sl-color-pink-950: hsl(315 100% 95.9%);

    --sl-color-rose-50: hsl(342.3 62.9% 21.5%);
    --sl-color-rose-100: hsl(342.8 68.9% 34.2%);
    --sl-color-rose-200: hsl(344.8 72.6% 37.3%);
    --sl-color-rose-300: hsl(346.9 75.8% 43.7%);
    --sl-color-rose-400: hsl(348.2 80.1% 52.7%);
    --sl-color-rose-500: hsl(350.4 94.8% 57.5%);
    --sl-color-rose-600: hsl(351.2 100% 58.1%);
    --sl-color-rose-700: hsl(352.3 100% 78.1%);
    --sl-color-rose-800: hsl(352 100% 86.2%);
    --sl-color-rose-900: hsl(354.5 100% 90.7%);
    --sl-color-rose-950: hsl(353.3 100% 95.7%);

    --sl-color-primary-50: var(--sl-color-sky-50);
    --sl-color-primary-100: var(--sl-color-sky-100);
    --sl-color-primary-200: var(--sl-color-sky-200);
    --sl-color-primary-300: var(--sl-color-sky-300);
    --sl-color-primary-400: var(--sl-color-sky-400);
    --sl-color-primary-500: var(--sl-color-sky-500);
    --sl-color-primary-600: var(--sl-color-sky-600);
    --sl-color-primary-700: var(--sl-color-sky-700);
    --sl-color-primary-800: var(--sl-color-sky-800);
    --sl-color-primary-900: var(--sl-color-sky-900);
    --sl-color-primary-950: var(--sl-color-sky-950);

    --sl-color-success-50: var(--sl-color-green-50);
    --sl-color-success-100: var(--sl-color-green-100);
    --sl-color-success-200: var(--sl-color-green-200);
    --sl-color-success-300: var(--sl-color-green-300);
    --sl-color-success-400: var(--sl-color-green-400);
    --sl-color-success-500: var(--sl-color-green-500);
    --sl-color-success-600: var(--sl-color-green-600);
    --sl-color-success-700: var(--sl-color-green-700);
    --sl-color-success-800: var(--sl-color-green-800);
    --sl-color-success-900: var(--sl-color-green-900);
    --sl-color-success-950: var(--sl-color-green-950);

    --sl-color-warning-50: var(--sl-color-amber-50);
    --sl-color-warning-100: var(--sl-color-amber-100);
    --sl-color-warning-200: var(--sl-color-amber-200);
    --sl-color-warning-300: var(--sl-color-amber-300);
    --sl-color-warning-400: var(--sl-color-amber-400);
    --sl-color-warning-500: var(--sl-color-amber-500);
    --sl-color-warning-600: var(--sl-color-amber-600);
    --sl-color-warning-700: var(--sl-color-amber-700);
    --sl-color-warning-800: var(--sl-color-amber-800);
    --sl-color-warning-900: var(--sl-color-amber-900);
    --sl-color-warning-950: var(--sl-color-amber-950);

    --sl-color-danger-50: var(--sl-color-red-50);
    --sl-color-danger-100: var(--sl-color-red-100);
    --sl-color-danger-200: var(--sl-color-red-200);
    --sl-color-danger-300: var(--sl-color-red-300);
    --sl-color-danger-400: var(--sl-color-red-400);
    --sl-color-danger-500: var(--sl-color-red-500);
    --sl-color-danger-600: var(--sl-color-red-600);
    --sl-color-danger-700: var(--sl-color-red-700);
    --sl-color-danger-800: var(--sl-color-red-800);
    --sl-color-danger-900: var(--sl-color-red-900);
    --sl-color-danger-950: var(--sl-color-red-950);

    --sl-color-neutral-50: var(--sl-color-gray-50);
    --sl-color-neutral-100: var(--sl-color-gray-100);
    --sl-color-neutral-200: var(--sl-color-gray-200);
    --sl-color-neutral-300: var(--sl-color-gray-300);
    --sl-color-neutral-400: var(--sl-color-gray-400);
    --sl-color-neutral-500: var(--sl-color-gray-500);
    --sl-color-neutral-600: var(--sl-color-gray-600);
    --sl-color-neutral-700: var(--sl-color-gray-700);
    --sl-color-neutral-800: var(--sl-color-gray-800);
    --sl-color-neutral-900: var(--sl-color-gray-900);
    --sl-color-neutral-950: var(--sl-color-gray-950);

    --sl-color-neutral-0: hsl(240, 5.9%, 11%);
    --sl-color-neutral-1000: hsl(0, 0%, 100%);

    --sl-border-radius-small: 0.1875rem;
    --sl-border-radius-medium: 0.25rem;
    --sl-border-radius-large: 0.5rem;
    --sl-border-radius-x-large: 1rem;

    --sl-border-radius-circle: 50%;
    --sl-border-radius-pill: 9999px;

    --sl-shadow-x-small: 0 1px 2px rgb(0 0 0 / 18%);
    --sl-shadow-small: 0 1px 2px rgb(0 0 0 / 24%);
    --sl-shadow-medium: 0 2px 4px rgb(0 0 0 / 24%);
    --sl-shadow-large: 0 2px 8px rgb(0 0 0 / 24%);
    --sl-shadow-x-large: 0 4px 16px rgb(0 0 0 / 24%);

    --sl-spacing-3x-small: 0.125rem;
    --sl-spacing-2x-small: 0.25rem;
    --sl-spacing-x-small: 0.5rem;
    --sl-spacing-small: 0.75rem;
    --sl-spacing-medium: 1rem;
    --sl-spacing-large: 1.25rem;
    --sl-spacing-x-large: 1.75rem;
    --sl-spacing-2x-large: 2.25rem;
    --sl-spacing-3x-large: 3rem;
    --sl-spacing-4x-large: 4.5rem;

    --sl-transition-x-slow: 1000ms;
    --sl-transition-slow: 500ms;
    --sl-transition-medium: 250ms;
    --sl-transition-fast: 150ms;
    --sl-transition-x-fast: 50ms;

    --sl-font-mono: SFMono-Regular, Consolas, "Liberation Mono", Menlo,
      monospace;
    --sl-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    --sl-font-serif: Georgia, "Times New Roman", serif;

    --sl-font-size-2x-small: 0.625rem;
    --sl-font-size-x-small: 0.75rem;
    --sl-font-size-small: 0.875rem;
    --sl-font-size-medium: 1rem;
    --sl-font-size-large: 1.25rem;
    --sl-font-size-x-large: 1.5rem;
    --sl-font-size-2x-large: 2.25rem;
    --sl-font-size-3x-large: 3rem;
    --sl-font-size-4x-large: 4.5rem;

    --sl-font-weight-light: 300;
    --sl-font-weight-normal: 400;
    --sl-font-weight-semibold: 500;
    --sl-font-weight-bold: 700;

    --sl-letter-spacing-denser: -0.03em;
    --sl-letter-spacing-dense: -0.015em;
    --sl-letter-spacing-normal: normal;
    --sl-letter-spacing-loose: 0.075em;
    --sl-letter-spacing-looser: 0.15em;

    --sl-line-height-denser: 1;
    --sl-line-height-dense: 1.4;
    --sl-line-height-normal: 1.8;
    --sl-line-height-loose: 2.2;
    --sl-line-height-looser: 2.6;

    --sl-focus-ring-color: var(--sl-color-primary-700);
    --sl-focus-ring-style: solid;
    --sl-focus-ring-width: 3px;
    --sl-focus-ring: var(--sl-focus-ring-style) var(--sl-focus-ring-width)
      var(--sl-focus-ring-color);
    --sl-focus-ring-offset: 1px;

    --sl-button-font-size-small: var(--sl-font-size-x-small);
    --sl-button-font-size-medium: var(--sl-font-size-small);
    --sl-button-font-size-large: var(--sl-font-size-medium);

    --sl-input-height-small: 1.875rem;
    --sl-input-height-medium: 2.5rem;
    --sl-input-height-large: 3.125rem;

    --sl-input-background-color: var(--sl-color-neutral-0);
    --sl-input-background-color-hover: var(--sl-input-background-color);
    --sl-input-background-color-focus: var(--sl-input-background-color);
    --sl-input-background-color-disabled: var(--sl-color-neutral-100);
    --sl-input-border-color: var(--sl-color-neutral-300);
    --sl-input-border-color-hover: var(--sl-color-neutral-400);
    --sl-input-border-color-focus: var(--sl-color-primary-500);
    --sl-input-border-color-disabled: var(--sl-color-neutral-300);
    --sl-input-border-width: 1px;
    --sl-input-required-content: "*";
    --sl-input-required-content-offset: -2px;
    --sl-input-required-content-color: var(--sl-input-label-color);

    --sl-input-border-radius-small: var(--sl-border-radius-medium);
    --sl-input-border-radius-medium: var(--sl-border-radius-medium);
    --sl-input-border-radius-large: var(--sl-border-radius-medium);

    --sl-input-font-family: var(--sl-font-sans);
    --sl-input-font-weight: var(--sl-font-weight-normal);
    --sl-input-font-size-small: var(--sl-font-size-small);
    --sl-input-font-size-medium: var(--sl-font-size-medium);
    --sl-input-font-size-large: var(--sl-font-size-large);
    --sl-input-letter-spacing: var(--sl-letter-spacing-normal);

    --sl-input-color: var(--sl-color-neutral-700);
    --sl-input-color-hover: var(--sl-color-neutral-700);
    --sl-input-color-focus: var(--sl-color-neutral-700);
    --sl-input-color-disabled: var(--sl-color-neutral-900);
    --sl-input-icon-color: var(--sl-color-neutral-500);
    --sl-input-icon-color-hover: var(--sl-color-neutral-600);
    --sl-input-icon-color-focus: var(--sl-color-neutral-600);
    --sl-input-placeholder-color: var(--sl-color-neutral-500);
    --sl-input-placeholder-color-disabled: var(--sl-color-neutral-600);
    --sl-input-spacing-small: var(--sl-spacing-small);
    --sl-input-spacing-medium: var(--sl-spacing-medium);
    --sl-input-spacing-large: var(--sl-spacing-large);

    --sl-input-focus-ring-color: hsl(198.6 88.7% 48.4% / 40%);
    --sl-input-focus-ring-offset: 0;

    --sl-input-filled-background-color: var(--sl-color-neutral-100);
    --sl-input-filled-background-color-hover: var(--sl-color-neutral-100);
    --sl-input-filled-background-color-focus: var(--sl-color-neutral-100);
    --sl-input-filled-background-color-disabled: var(--sl-color-neutral-100);
    --sl-input-filled-color: var(--sl-color-neutral-800);
    --sl-input-filled-color-hover: var(--sl-color-neutral-800);
    --sl-input-filled-color-focus: var(--sl-color-neutral-700);
    --sl-input-filled-color-disabled: var(--sl-color-neutral-800);

    --sl-input-label-font-size-small: var(--sl-font-size-small);
    --sl-input-label-font-size-medium: var(--sl-font-size-medium);
    --sl-input-label-font-size-large: var(--sl-font-size-large);
    --sl-input-label-color: inherit;

    --sl-input-help-text-font-size-small: var(--sl-font-size-x-small);
    --sl-input-help-text-font-size-medium: var(--sl-font-size-small);
    --sl-input-help-text-font-size-large: var(--sl-font-size-medium);
    --sl-input-help-text-color: var(--sl-color-neutral-500);

    --sl-toggle-size-small: 0.875rem;
    --sl-toggle-size-medium: 1.125rem;
    --sl-toggle-size-large: 1.375rem;

    --sl-overlay-background-color: hsl(0 0% 0% / 43%);

    --sl-panel-background-color: var(--sl-color-neutral-50);
    --sl-panel-border-color: var(--sl-color-neutral-200);
    --sl-panel-border-width: 1px;

    --sl-tooltip-border-radius: var(--sl-border-radius-medium);
    --sl-tooltip-background-color: var(--sl-color-neutral-800);
    --sl-tooltip-color: var(--sl-color-neutral-0);
    --sl-tooltip-font-family: var(--sl-font-sans);
    --sl-tooltip-font-weight: var(--sl-font-weight-normal);
    --sl-tooltip-font-size: var(--sl-font-size-small);
    --sl-tooltip-line-height: var(--sl-line-height-dense);
    --sl-tooltip-padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-small);
    --sl-tooltip-arrow-size: 6px;

    --sl-z-index-drawer: 700;
    --sl-z-index-dialog: 800;
    --sl-z-index-dropdown: 900;
    --sl-z-index-toast: 950;
    --sl-z-index-tooltip: 1000;
  }

  .sl-scroll-lock {
    padding-right: var(--sl-scroll-lock-size) !important;
    overflow: hidden !important;
  }

  .sl-toast-stack {
    position: fixed;
    top: 0;
    inset-inline-end: 0;
    z-index: var(--sl-z-index-toast);
    width: 28rem;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
  }

  .sl-toast-stack sl-alert {
    margin: var(--sl-spacing-medium);
  }

  .sl-toast-stack sl-alert::part(base) {
    box-shadow: var(--sl-shadow-large);
  }
`;

export { sholelaceLightStyles, sholelaceDarkStyles };

const getShoelaceStyles = (isDark = false) =>
  isDark ? sholelaceDarkStyles : sholelaceLightStyles;

export default getShoelaceStyles;
