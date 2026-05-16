import { X, BookOpen, Moon, AlertTriangle, Calculator } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const items = [
  { icon: BookOpen, title: "Browse topics", desc: "Open the topics panel to explore environmental categories and detailed solutions." },
  { icon: Moon, title: "Light / Dark mode", desc: "Toggle the theme from the header to suit your viewing preference." },
  { icon: AlertTriangle, title: "Report an emergency", desc: "Use the floating hazard button (bottom-left) to call our emergency line directly." },
  { icon: Calculator, title: "Impact calculator", desc: "Estimate your environmental footprint from the home screen." },
];

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl w-full max-w-md p-6 space-y-4 animate-slide-in">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">How to use TB</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg gradient-forest flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HelpModal;
