import { 
  RiGlobalLine, 
  RiPaletteLine, 
  RiCodeBoxLine, 
  RiPlugLine,
  RiShieldCheckLine,
  RiRocketLine 
} from '@remixicon/react';

const features = [
  {
    icon: RiGlobalLine,
    title: 'Framework Agnostic',
    description: 'Web components that work seamlessly with React, Vue, Angular, vanilla HTML, or any web framework.',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    icon: RiPaletteLine,
    title: 'Fully Customizable',
    description: 'Complete design control with CSS custom properties, design tokens, and shadcn/ui-inspired architecture.',
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    icon: RiShieldCheckLine,
    title: 'GA4GH Standards',
    description: 'Built-in compatibility with all major GA4GH API specifications for federated cloud computing.',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    icon: RiPlugLine,
    title: 'Provider Architecture',
    description: 'Pluggable data layer supporting REST APIs, GraphQL endpoints, and mock providers for development.',
    color: 'text-orange-600 dark:text-orange-400'
  },
  {
    icon: RiCodeBoxLine,
    title: 'TypeScript Ready',
    description: 'Comprehensive TypeScript support with full type definitions for enhanced developer experience.',
    color: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    icon: RiRocketLine,
    title: 'Production Ready',
    description: 'Battle-tested components used in real federated cloud environments across research organizations.',
    color: 'text-red-600 dark:text-red-400'
  }
];

export default function FeaturesGrid() {
  return (
    <section className='mt-24 md:mt-32 px-4 max-w-7xl mx-auto'>
      {/* Section Header */}
      <div className='text-center mb-16'>
        <h2 className='text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4'>
          Built for Modern Development
        </h2>
        <p className='text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto'>
          Everything you need to build robust, scalable applications for federated cloud environments.
        </p>
      </div>

      {/* Features Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index}
              className='group p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:shadow-lg transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-600'
            >
              <div className={`inline-flex p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 mb-4 group-hover:scale-105 transition-transform duration-300`}>
                <Icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              
              <h3 className='text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2'>
                {feature.title}
              </h3>
              
              <p className='text-zinc-600 dark:text-zinc-400 leading-relaxed'>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
} 