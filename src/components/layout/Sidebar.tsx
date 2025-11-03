import { Link, useLocation } from 'react-router-dom';
import { FileText, Clock, Send, Wrench, X, Activity, History, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/hooks/useTheme';

const menuItems = [
  { icon: FileText, label: 'Novo Orçamento', path: '/' },
  { icon: Clock, label: 'Rascunhos', path: '/rascunhos' },
  { icon: Send, label: 'Enviados', path: '/enviados' },
  { icon: Activity, label: 'Em Andamento', path: '/em-andamento' },
  { icon: History, label: 'Histórico', path: '/historico' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
                <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={theme === 'dark' ? '/logo-claro.svg' : 'https://cdn-ai.onspace.ai/onspace/project/image/PHFKscnXvNiErZvXWg4gGJ/Grupo_2.svg'}
              alt="Torqueo Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {user && (
            <div className="bg-sidebar-accent rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Logado como:</p>
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.email}</p>
            </div>
          )}
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>

          <div className="bg-sidebar-accent rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Versão 1.0</p>
            <p className="text-xs text-sidebar-foreground">
              Sistema Torqueo de orçamentos
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};