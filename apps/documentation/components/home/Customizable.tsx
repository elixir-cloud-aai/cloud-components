import { useState } from 'react';

const Customizable = () => {
    const [customColor, setCustomColor] = useState('#000000');

    return (
        <section className="space-y-8 mt-32">
            <h2 className="text-4xl font-extrabold text-center">Customizable</h2>
            <p className="text-center text-xl text-zinc-600 dark:text-zinc-300 max-w-4xl mx-auto">
                Easily adapt our components to match your brand's design language.
                Our flexible architecture allows for deep customization while maintaining functionality.
            </p>
            <input
                type="color"
                id="colorPicker"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
            />
        </section >
    );
};

export default Customizable;