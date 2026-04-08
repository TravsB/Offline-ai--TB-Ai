import { Calculator, Droplets, Trash2 } from "lucide-react";
import { useState } from "react";

type CalculatorTab = "carbon" | "water" | "waste";

const ImpactCalculator = () => {
  const [tab, setTab] = useState<CalculatorTab>("carbon");
  const [carbonInputs, setCarbonInputs] = useState({ electricity: "", gas: "", miles: "", flights: "" });
  const [waterInputs, setWaterInputs] = useState({ shower: "", dishwasher: "", laundry: "" });
  const [wasteInputs, setWasteInputs] = useState({ household: "", recycling: "", composting: "no" });
  const [result, setResult] = useState<string | null>(null);

  const calculateCarbon = () => {
    const e = parseFloat(carbonInputs.electricity) || 0;
    const g = parseFloat(carbonInputs.gas) || 0;
    const m = parseFloat(carbonInputs.miles) || 0;
    const f = parseFloat(carbonInputs.flights) || 0;
    const total = e * 12 * 1.22 + g * 12 * 11.7 + m * 12 * 0.89 + f * 1100;
    const tons = total / 2000;
    const status = tons > 8 ? "⚠️ Above US average" : tons < 4 ? "🌱 Below global average!" : "📊 Near global average";
    setResult(`Your annual carbon footprint: **${total.toFixed(0)} lbs (${tons.toFixed(1)} tons) CO₂**\n\nUS Avg: 16 tons | Global Avg: 4 tons | Target: 2 tons\n\n${status}`);
  };

  const calculateWater = () => {
    const s = parseFloat(waterInputs.shower) || 0;
    const d = parseFloat(waterInputs.dishwasher) || 0;
    const l = parseFloat(waterInputs.laundry) || 0;
    const total = s * 30 * 2.5 + d * 4.3 * 6 + l * 4.3 * 25;
    const daily = total / 30;
    const status = daily > 80 ? "⚠️ Consider water-saving measures" : daily < 50 ? "🌱 Excellent conservation!" : "📊 Good water usage";
    setResult(`Monthly water usage: **${total.toFixed(0)} gallons** (${daily.toFixed(0)} gal/day)\n\nUS Avg: 80 gal/day | Target: 50 gal/day\n\n${status}`);
  };

  const calculateWaste = () => {
    const h = parseFloat(wasteInputs.household) || 1;
    const r = parseFloat(wasteInputs.recycling) || 0;
    const c = wasteInputs.composting === "yes";
    const base = h * 28;
    const actual = Math.max(base - r * h * 5 - (c ? h * 14 : 0), 0);
    const reduction = ((base - actual) / base * 100);
    const status = reduction > 50 ? "🌱 Great waste reduction!" : reduction < 25 ? "⚠️ Consider more recycling" : "📊 Moderate reduction";
    setResult(`Weekly landfill waste: **${actual.toFixed(0)} lbs** (${reduction.toFixed(0)}% reduced)\n\nUS Avg: 4.5 lbs/person/day | Zero Waste: <1 lb/person/day\n\n${status}`);
  };

  const tabs = [
    { id: "carbon" as const, icon: <Calculator className="w-3.5 h-3.5" />, label: "Carbon" },
    { id: "water" as const, icon: <Droplets className="w-3.5 h-3.5" />, label: "Water" },
    { id: "waste" as const, icon: <Trash2 className="w-3.5 h-3.5" />, label: "Waste" },
  ];

  const inputClass = "w-full px-3 py-2 text-sm rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50";

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setResult(null); }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-all ${
              tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "carbon" && (
        <div className="space-y-3">
          <input className={inputClass} type="number" placeholder="Monthly electricity (kWh)" value={carbonInputs.electricity} onChange={(e) => setCarbonInputs({ ...carbonInputs, electricity: e.target.value })} />
          <input className={inputClass} type="number" placeholder="Monthly gas (therms)" value={carbonInputs.gas} onChange={(e) => setCarbonInputs({ ...carbonInputs, gas: e.target.value })} />
          <input className={inputClass} type="number" placeholder="Monthly miles driven" value={carbonInputs.miles} onChange={(e) => setCarbonInputs({ ...carbonInputs, miles: e.target.value })} />
          <input className={inputClass} type="number" placeholder="Flights per year" value={carbonInputs.flights} onChange={(e) => setCarbonInputs({ ...carbonInputs, flights: e.target.value })} />
          <button onClick={calculateCarbon} className="w-full py-2.5 rounded-lg gradient-forest text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Calculate</button>
        </div>
      )}

      {tab === "water" && (
        <div className="space-y-3">
          <input className={inputClass} type="number" placeholder="Shower minutes/day" value={waterInputs.shower} onChange={(e) => setWaterInputs({ ...waterInputs, shower: e.target.value })} />
          <input className={inputClass} type="number" placeholder="Dishwasher loads/week" value={waterInputs.dishwasher} onChange={(e) => setWaterInputs({ ...waterInputs, dishwasher: e.target.value })} />
          <input className={inputClass} type="number" placeholder="Laundry loads/week" value={waterInputs.laundry} onChange={(e) => setWaterInputs({ ...waterInputs, laundry: e.target.value })} />
          <button onClick={calculateWater} className="w-full py-2.5 rounded-lg gradient-ocean text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Calculate</button>
        </div>
      )}

      {tab === "waste" && (
        <div className="space-y-3">
          <input className={inputClass} type="number" placeholder="Household size" value={wasteInputs.household} onChange={(e) => setWasteInputs({ ...wasteInputs, household: e.target.value })} />
          <input className={inputClass} type="number" placeholder="Recycling times/week" value={wasteInputs.recycling} onChange={(e) => setWasteInputs({ ...wasteInputs, recycling: e.target.value })} />
          <select className={inputClass} value={wasteInputs.composting} onChange={(e) => setWasteInputs({ ...wasteInputs, composting: e.target.value })}>
            <option value="no">Not composting</option>
            <option value="yes">Yes, composting</option>
          </select>
          <button onClick={calculateWaste} className="w-full py-2.5 rounded-lg gradient-earth text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Calculate</button>
        </div>
      )}

      {result && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-foreground whitespace-pre-line">
          {result.split("**").map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ImpactCalculator;
