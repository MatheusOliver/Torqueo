import { Menu } from 'lucide-react';

interface MobileMenuProps {
  onToggle: () => void;
}

export const MobileMenu = ({ onToggle }: MobileMenuProps) => {
  return (
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-sidebar border-b border-sidebar-border z-30 h-16">
      <div className="flex items-center justify-between p-4 h-full">
        <img 
          src="https://cdn-ai.onspace.ai/onspace/project/image/PHFKscnXvNiErZvXWg4gGJ/Grupo_2.svg" 
          alt="Torqueo Logo" 
          className="h-8 w-auto"
        />
        
        <button
          onClick={onToggle}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};