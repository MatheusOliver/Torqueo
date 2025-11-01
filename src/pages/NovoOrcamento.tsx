import { useEffect, useState } from 'react';
import { useOrcamento } from '@/hooks/useOrcamento';
import { ClienteForm } from '@/components/forms/ClienteForm';
import { ProdutoForm } from '@/components/forms/ProdutoForm';
import { ServicoForm } from '@/components/forms/ServicoForm';
import { ItensLista } from '@/components/ItensLista';
import { GerarOrcamento } from '@/components/GerarOrcamento';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User } from 'lucide-react';
import { Cliente } from '@/types';

export const NovoOrcamento = () => {
  const { criarNovoOrcamento, orcamentoAtual, buscarCliente, atualizarCliente } = useOrcamento();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Cliente[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    console.log('Iniciando novo orçamento');
    if (!orcamentoAtual) {
      criarNovoOrcamento();
    }
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      const results = buscarCliente(term);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectCliente = (cliente: Cliente) => {
    atualizarCliente(cliente);
    setSearchTerm('');
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">Novo Orçamento</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Preencha os dados abaixo para criar um novo orçamento profissional
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {orcamentoAtual && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Data</p>
            <p className="text-lg font-semibold text-foreground">{orcamentoAtual.data}</p>
          </div>
        )}
      </div>

      {/* Busca de Clientes */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Buscar Cliente Cadastrado</h3>
            </div>
            <Input
              type="text"
              placeholder="Digite o nome, CPF/CNPJ ou telefone do cliente..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
            
            {/* Resultados da busca */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((cliente, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectCliente(cliente)}
                    className="w-full px-4 py-3 text-left hover:bg-accent border-b border-border last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{cliente.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {cliente.cpfCnpj} • {cliente.telefone}
                        </p>
                        {cliente.veiculo && (
                          <p className="text-xs text-muted-foreground">
                            {cliente.marca} {cliente.veiculo}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {showResults && searchTerm.length >= 2 && searchResults.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg p-4">
                <p className="text-sm text-muted-foreground text-center">
                  Nenhum cliente encontrado. Cadastre um novo abaixo.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ClienteForm />
      <ProdutoForm />
      <ServicoForm />
      <ItensLista />
      <GerarOrcamento />
    </div>
  );
};
