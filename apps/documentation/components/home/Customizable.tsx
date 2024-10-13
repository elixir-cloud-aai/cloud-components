import { useState } from 'react';
import CreateRun from '../packages/wes/createRun/createRun';
import Link from 'next/link';

const Customizable = () => {
  const [customColor, setCustomColor] = useState('#3c83f6');
  const [customCorner, setCustomCorner] = useState(0.5);
  const [customDepth, setCustomDepth] = useState(1);
  const [customDensity, setCustomDensity] = useState(0.5);
  const [customSizing, setCustomSizing] = useState(0.9);
  const [customFontSize, setCustomFontSize] = useState(0.9);
  const [customMotion, setCustomMotion] = useState(250);

  return (
    <section className='space-y-8 mt-32' id='customizable'>
      <h2 className='text-4xl font-extrabold text-center'>Customizable</h2>
      <p className='text-center text-xl text-zinc-600 dark:text-zinc-300 max-w-4xl mx-auto'>
        Easily adapt our components to match your brand's design language. Our flexible architecture
        allows for deep customization while maintaining functionality.
        <Link href='/docs/customization' className='text-blue-500'> Learn more → </Link>
      </p>
      <div className='flex justify-center gap-10'>
        <div className='flex flex-col gap-6 justify-center w-[40%]'>
          {[
            { label: 'Brand Color', id: '--ecc-color-brand', type: 'color', min: undefined, max: undefined, value: customColor, setValue: setCustomColor },
            { label: 'Corner Radius', id: '--ecc-corner', type: 'range', min: 0, max: 1, value: customCorner, setValue: setCustomCorner, unit: 'rem' },
            { label: 'Depth', id: '--ecc-depth', type: 'range', min: 0, max: 1, value: customDepth, setValue: setCustomDepth },
            { label: 'Density', id: '--ecc-density', type: 'range', min: 0, max: 1, value: customDensity, setValue: setCustomDensity, unit: 'rem' },
            { label: 'Sizing', id: '--ecc-sizing', type: 'range', min: 0, max: 1.5, value: customSizing, setValue: setCustomSizing, unit: 'rem' },
            { label: 'Font Size', id: '--ecc-font-size', type: 'range', min: 0.5, max: 1.5, value: customFontSize, setValue: setCustomFontSize, unit: 'rem' },
            { label: 'Motion', id: '--ecc-motion', type: 'range', min: 0, max: 1000, value: customMotion, setValue: setCustomMotion, unit: 'ms' },
          ].map(({ label, id, type, min, max, value, setValue, unit }) => (
            <div key={id} className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <label htmlFor={id} className='text-sm font-medium text-gray-700 dark:text-gray-300'>{label}</label>
                <span className='text-sm text-gray-500 dark:text-gray-400'>{value}{unit}</span>
              </div>
              <input
                type={type}
                id={id}
                min={min}
                max={max}
                step={type === 'range' ? '0.01' : undefined}
                className={`w-full rounded-lg appearance-none cursor-pointer ${
                  type === 'color' ? 'h-10 p-0 rounded-lg bg-transparent m-[-3px] w-[calc(100%+6px)]' : 'h-2 bg-gray-200 dark:bg-gray-700'
                }`}
                value={value}
                onChange={(e) => {
                  const newValue = type === 'range' ? parseFloat(e.target.value) : e.target.value;
                  setValue(newValue as any);
                  document.documentElement.style.setProperty(id, `${newValue}${unit || ''}`);
                }}
              />
            </div>
          ))}
        </div>
        <div className='w-[40%]'>
          <CreateRun />
        </div>
      </div>
    </section>
  );
};

export default Customizable;
