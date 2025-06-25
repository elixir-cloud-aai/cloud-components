'use client';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import RunsPreview from '@/components/packages/wes/RunsPreview';
import RunCreatePreview from '@/components/packages/wes/RunCreatePreview';
import ToolsPreview from '@/components/packages/trs/ToolsPreview';
import ServicePreview from '@/components/packages/service-registry/ServicePreview';
import ToolCreatePreview from '@/components/packages/trs-filer/ToolCreatePreview';
import ServiceCreatePreview from '@/components/packages/cloud-registry/ServiceCreatePreview';
import { EccUtilsDesignSelect, EccUtilsDesignSelectItem, EccUtilsDesignSelectContent, EccUtilsDesignSelectTrigger, EccUtilsDesignSelectValue } from '@elixir-cloud/design/react';

const themes = [
  {
    id: 'default',
    label: 'Theme: Default',
    value: 'default'
  },
  {
    id: 'mono',
    label: 'Theme: Mono',
    value: 'mono'
  }
];

const services = [
  {
    id: 'workflow-execution',
    label: 'Workflow Execution',
    description: 'WES - Execute and manage workflows in federated cloud environments',
    components: [
      { name: 'Runs List', component: RunsPreview },
      { name: 'Create Run', component: RunCreatePreview }
    ],
    link: "/docs/wes/components/runs"
  },
  {
    id: 'tool-registry',
    label: 'Tool Registry',
    description: 'TRS - Discover and manage computational tools and workflows',
    components: [
      { name: 'Tools List', component: ToolsPreview }
    ],
    link: "/docs/trs/components/tools"
  },
  {
    id: 'service-registry',
    label: 'Service Registry',
    description: 'Discover and register GA4GH-compliant services',
    components: [
      { name: 'Service Details', component: ServicePreview }
    ],
    link: "/docs/service-registry/components/services"
  },
  {
    id: 'cloud-registry',
    label: 'Cloud Registry',
    description: 'Elixir Cloud service registration and management',
    components: [
      { name: 'Create Service', component: ServiceCreatePreview }
    ],
    link: "/docs/cloud-registry/components/service-create"
  },
  {
    id: 'trs-filer',
    label: 'TRS-Filer',
    description: 'Advanced tool management with file handling capabilities',
    components: [
      { name: 'Create Tool', component: ToolCreatePreview }
    ],
    link: "/docs/trs-filer/components/tool-create"
  }
];

export default function ServicesShowcase() {
  const [activeService, setActiveService] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const { resolvedTheme } = useTheme();

  return (
    <section className='mt-24 md:mt-32 px-4 mx-auto'>

      {/* Service Tabs */}
      <div className='border-b border-zinc-200 dark:border-zinc-700 mb-8 relative'>
        <div className='flex flex-wrap gap-0 -mb-px'>
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => setActiveService(index)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeService === index
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {service.label}
            </button>
          ))}
        </div>

        <div className='min-w-[160px] absolute right-0 top-0'>
          <EccUtilsDesignSelect 
            value={selectedTheme} 
            onEccInputChanged={(e) => {
              console.log('Theme changed:', e.detail.value);
              setSelectedTheme(e.detail.value);
            }}
          >
            <EccUtilsDesignSelectTrigger className="part:w-full">
              <EccUtilsDesignSelectValue placeholder="Select theme" />
            </EccUtilsDesignSelectTrigger>
            <EccUtilsDesignSelectContent>
              {themes.map((theme) => (
                <EccUtilsDesignSelectItem key={theme.id} value={theme.value}>
                  {theme.label}
                </EccUtilsDesignSelectItem>
              ))}
            </EccUtilsDesignSelectContent>
          </EccUtilsDesignSelect>
        </div>
      </div>

      {/* Active Service Content with Theme Applied */}
      <div className={`mb-8 theme-${selectedTheme} ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
        {/* Component Previews */}
        <div className={`grid gap-4 ${services[activeService].components.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {services[activeService].components.map((comp, index) => {
            const Component = comp.component;
            return (
              <div key={index}>
                <Component />
              </div>
            );
          })}
        </div>
        <div className='flex justify-center mt-4'>
          <div className='flex items-center justify-center'>
            <a href={services[activeService].link} className='inline-flex items-center px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors'>
              View More Components
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 