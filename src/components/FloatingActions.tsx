import { AlertTriangle, BookOpen } from "lucide-react";

interface FloatingActionsProps {
  onEmergency: () => void;
  onToggleSidebar: () => void;
}

const FloatingActions = ({ onEmergency, onToggleSidebar }: FloatingActionsProps) => {
  return (
    <>
      {/* Emergency button - fixed bottom-left for easy thumb access */}
      <button
        onClick={onEmergency}
        className="fixed bottom-6 left-6 z-30 w-14 h-14 rounded-2xl gradient-sunset text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
        title="Report Emergency"
      >
        <AlertTriangle className="w-6 h-6" />
      </button>

      {/* Topics button - bottom-right, desktop only */}
      <button
        onClick={onToggleSidebar}
        className="hidden md:flex fixed bottom-6 right-6 z-30 w-12 h-12 rounded-xl gradient-forest text-primary-foreground items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="Browse Topics"
      >
        <BookOpen className="w-5 h-5" />
      </button>
    </>
  );
};

export default FloatingActions;
