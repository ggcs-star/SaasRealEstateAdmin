// Steps/Step4Rules.jsx
import { Settings } from 'lucide-react';

export default function Step4Rules({ config, setConfig }) {

    return (
        <div className="p-8 space-y-6">

            <h3 className="font-bold flex gap-2 items-center">
                <Settings /> Rules
            </h3>

            <input
                type="number"
                value={config.rules.holdDurationHours}
                onChange={(e) => setConfig({
                    ...config,
                    rules: { ...config.rules, holdDurationHours: e.target.value }
                })}
                className="border p-2 rounded"
            />

        </div>
    );
}