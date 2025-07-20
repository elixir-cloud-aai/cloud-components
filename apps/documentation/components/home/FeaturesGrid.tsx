import {
  EccUtilsDesignCard,
  EccUtilsDesignCardHeader,
  EccUtilsDesignCardTitle,
  EccUtilsDesignCardDescription,
  EccUtilsDesignCardContent,
} from '@elixir-cloud/design/react';
import { EarthIcon } from '@/components/icons/earth';
import { ConnectIcon } from '@/components/icons/connect';
import { SettingsIcon } from '@/components/icons/settings';
import { BlocksIcon } from '../icons/blocks';
import { GitPullRequestIcon } from '../icons/git';
import { ChartColumnIncreasingIcon } from '../icons/chart';
import { createRef, useRef } from 'react';

const features = [
  {
    icon: ConnectIcon,
    title: 'Framework Agnostic',
    description:
      'Web components that work seamlessly with React, Vue, Angular, vanilla HTML, or any web framework.',
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: SettingsIcon,
    title: 'Fully Customizable',
    description:
      'Complete design control with CSS custom properties, design tokens, and shadcn/ui-inspired architecture.',
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: EarthIcon,
    title: 'GA4GH Standards',
    description:
      'Built-in compatibility with all major GA4GH API specifications for federated cloud computing.',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    icon: BlocksIcon,
    title: 'Provider Architecture',
    description:
      'Pluggable data layer supporting REST APIs, GraphQL endpoints, and mock providers for development.',
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: GitPullRequestIcon,
    title: 'Open Source',
    description: 'ECC is open source and free to use. It is licensed under the Apache License 2.0.',
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: ChartColumnIncreasingIcon,
    title: 'Production Ready',
    description:
      'Battle-tested components used in real federated cloud environments across research organizations.',
    color: 'text-red-600 dark:text-red-400',
  },
];

interface IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export default function FeaturesGrid() {
  const iconRefs = useRef(features.map(() => createRef<IconHandle>()));
  return (
    <section className='mt-24 md:mt-32 px-4 max-w-7xl mx-auto'>
      {/* Section Header */}
      <div className='text-center mb-16'>
        <h2 className='text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4'>
          Built for Modern Development
        </h2>
        <p className='text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto'>
          Everything you need to build robust, scalable applications for federated cloud
          environments.
        </p>
      </div>

      {/* Features Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <EccUtilsDesignCard
              key={index}
              className='h-full part:h-full part:hover:shadow-lg part:transition-all part:duration-300 part:group'
              onMouseEnter={() => iconRefs.current[index].current?.startAnimation()}
              onMouseLeave={() => iconRefs.current[index].current?.stopAnimation()}
            >
              <EccUtilsDesignCardHeader className='part:flex part:flex-row part:items-start part:space-y-4'>
                <Icon
                  ref={iconRefs.current[index]}
                  className={`h-8 w-8 scale-[.8] ${feature.color}`}
                />
                <EccUtilsDesignCardTitle className='part:text-xl part:font-semibold part:text-zinc-900 part:dark:text-zinc-100 part:mb-2'>
                  {feature.title}
                </EccUtilsDesignCardTitle>
              </EccUtilsDesignCardHeader>
              <EccUtilsDesignCardContent>
                <EccUtilsDesignCardDescription className='part:text-zinc-600 part:dark:text-zinc-400 part:leading-relaxed'>
                  {feature.description}
                </EccUtilsDesignCardDescription>
              </EccUtilsDesignCardContent>
            </EccUtilsDesignCard>
          );
        })}
      </div>
    </section>
  );
}
