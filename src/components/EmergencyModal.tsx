import { X, AlertTriangle, PawPrint, Flame, Axe, Phone, MessageCircle } from "lucide-react";
import { emergencyTypes } from "@/data/environmentalDatabase";
import { useState } from "react";

const PHONE_NUMBER = "0723951487";
const WHATSAPP_NUMBER = "254723951487"; // International format for WhatsApp

const iconMap: Record<string, React.ReactNode> = {
  "paw-print": <PawPrint className="w-6 h-6" />,
  "alert-triangle": <AlertTriangle className="w-6 h-6" />,
  axe: <Axe className="w-6 h-6" />,
  flame: <Flame className="w-6 h-6" />,
};

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyModal = ({ isOpen, onClose }: EmergencyModalProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");

  if (!isOpen) return null;

  const selected = emergencyTypes.find((t) => t.id === selectedType);

  const handleWhatsApp = () => {
    const message = selected
      ? `${selected.whatsappMessage}\n\n📍 Location: ${location || "Not specified"}\n📝 Details: ${details || "No additional details"}`
      : `🚨 ENVIRONMENTAL EMERGENCY\n\n📍 Location: ${location || "Not specified"}\n📝 Details: ${details || "No additional details"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${PHONE_NUMBER}`, "_self");
  };

  const handleReset = () => {
    setSelectedType(null);
    setDetails("");
    setLocation("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-strong rounded-2xl overflow-hidden border border-destructive/30 animate-slide-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Report Emergency</h2>
                <p className="text-xs text-muted-foreground">Environmental hazard reporting</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!selectedType ? (
            <div className="grid grid-cols-2 gap-3">
              {emergencyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 transition-all duration-200 text-center group"
                >
                  <div className="text-destructive mb-2 flex justify-center group-hover:scale-110 transition-transform">
                    {iconMap[type.icon]}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{type.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={handleReset} className="text-xs text-accent hover:underline">
                ← Choose different type
              </button>

              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-medium text-destructive">{selected?.title}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where is the emergency?"
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive/50"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Details</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe the situation..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-sunset text-white font-medium text-sm transition-colors hover:opacity-90"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Emergency line: <span className="font-mono text-foreground">{PHONE_NUMBER}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;
