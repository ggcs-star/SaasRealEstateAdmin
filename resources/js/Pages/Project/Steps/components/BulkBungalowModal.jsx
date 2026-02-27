import { useState } from "react";
import { Home, Plus, Trash2 } from "lucide-react";

export default function BungalowUnits({ data, setData, bulkBungalow, setBulkBungalow }) {

    const [setup, setSetup] = useState({
        bungalows: 4,
        prefix: "B"
    });

    const generateBungalows = () => {
        let b = [];

        for (let i = 1; i <= setup.bungalows; i++) {
            b.push({
                unit_number: setup.prefix + "-" + i,
                bhk: "3BHK",
                status: "available",
                type: "bungalow"
            });
        }

        setData("bungalows", b);
        setData("towers", []);
    };

    const updateBungalow = (i, field, value) => {
        let b = [...data.bungalows];
        b[i][field] = value;
        setData("bungalows", b);
    };

    return (
        <div>

            <h4 className="flex gap-2 items-center">
                <Home /> Bungalow Configuration
            </h4>

            <button onClick={generateBungalows}>
                Generate
            </button>

            {data.bungalows?.map((b, i) => (
                <div key={i}>
                    <input
                        value={b.unit_number}
                        onChange={(e) =>
                            updateBungalow(i, "unit_number", e.target.value)
                        }
                    />
                </div>
            ))}

        </div>
    );
}