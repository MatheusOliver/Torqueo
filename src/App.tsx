import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { OrcamentoProvider } from '@/hooks/useOrcamento';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Login } from '@/pages/Login';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileMenu } from '@/components/layout/MobileMenu';

import { NovoOrcamento } from '@/pages/NovoOrcamento';
import { Rascunhos } from '@/pages/Rascunhos';
import { Enviados } from '@/pages/Enviados';
import { PreviewPDF } from '@/pages/PreviewPDF';
import { EmAndamento } from '@/pages/EmAndamento';
import { Historico } from '@/pages/Historico';
import { Configuracoes } from '@/pages/Configuracoes';
import { Toaster } from '@/components/ui/toaster';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  // Aplicar tema inicial das configurações
  useEffect(() => {
    const savedConfig = localStorage.getItem('torqueo_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (config.tema === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Mobile menu button - visible only on mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Mobile Header */}
        <MobileMenu onToggle={() => setSidebarOpen(true)} />
        
        {/* Sidebar - sempre visível no desktop */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content - com margin-left no desktop para compensar o menu fixo */}
        <main className="pt-16 lg:pt-0 lg:ml-64 min-h-screen transition-all duration-300">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<NovoOrcamento />} />
              <Route path="/rascunhos" element={<Rascunhos />} />
              <Route path="/enviados" element={<Enviados />} />
              <Route path="/em-andamento" element={<EmAndamento />} />
              <Route path="/historico" element={<Historico />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/preview" element={<PreviewPDF />} />
            </Routes>
          </div>
        </main>
        
        <Toaster />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <OrcamentoProvider>
          <AppContent />
        </OrcamentoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;