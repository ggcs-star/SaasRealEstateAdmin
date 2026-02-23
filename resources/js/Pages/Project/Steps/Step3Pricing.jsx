// Steps/Step3Pricing.jsx
import { DollarSign } from 'lucide-react';

export default function Step3Pricing({ config, setConfig }) {

    return (
        <div className="p-8 space-y-6">

            <h3 className="font-bold flex gap-2 items-center">
                <DollarSign /> Pricing
            </h3>

            <input
                type="number"
                placeholder="Base Price"
                value={config.pricing.basePrice}
                onChange={(e) => setConfig({
                    ...config,
                    pricing: { ...config.pricing, basePrice: e.target.value }
                })}
                className="w-full border p-3 rounded-lg"
            />

        </div>
    );
}