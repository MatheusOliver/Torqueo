import { useOrcamento } from '@/hooks/useOrcamento';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export const Rascunhos = () => {
  const { orcamentos, carregarOrcamento, excluirOrcamento } = useOrcamento();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Ordenar por ID (timestamp) - mais recentes primeiro
  const rascunhos = orcamentos
    .filter(o => o.status === 'rascunho')
    .sort((a, b) => Number(b.id) - Number(a.id));

  const handleEditar = (id: string) => {
    console.log('Editando rascunho:', id);
    carregarOrcamento(id);
    navigate('/');
  };

  const handleExcluir = (id: string) => {
    if (window.confirm('Deseja realmente excluir este rascunho?')) {
      console.log('Excluindo rascunho:', id);
      excluirOrcamento(id);
      toast({
        title: 'Rascunho excluído!',
        description: 'O rascunho foi removido com sucesso.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Clock className="w-10 h-10 text-yellow-500" />
          Rascunhos
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Orçamentos salvos que ainda não foram finalizados
        </p>
      </div>

      {rascunhos.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum rascunho encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Você não tem orçamentos em rascunho no momento.
              </p>
              <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
                Criar Novo Orçamento
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rascunhos.map((orcamento) => (
            <Card key={orcamento.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {orcamento.cliente.nome || 'Cliente não informado'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{orcamento.data}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-medium">
                    Rascunho
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {orcamento.cliente.veiculo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Veículo:</span>
                      <span className="font-medium">{orcamento.cliente.marca} {orcamento.cliente.veiculo}</span>
                    </div>
                  )}
                  {orcamento.cliente.placa && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Placa:</span>
                      <span className="font-medium">{orcamento.cliente.placa}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Itens:</span>
                    <span className="font-medium">{orcamento.itens.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold text-primary">R$ {orcamento.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditar(orcamento.id)}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleExcluir(orcamento.id)}
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};