import { AlertTriangle } from "lucide-react";

interface FloatingActionsProps {
  onEmergency: () => void;
}

const FloatingActions = ({ onEmergency }: FloatingActionsProps) => {
  return (
    <button
      onClick={onEmergency}
      className="fixed bottom-6 left-6 z-30 w-14 h-14 rounded-2xl gradient-sunset text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
      title="Report Emergency"
    >
      <AlertTriangle className="w-6 h-6" />
    </button>
  );
};

export default FloatingActions;
