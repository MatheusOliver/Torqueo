import { useOrcamento } from '@/hooks/useOrcamento';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Package, Wrench } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const ItensLista = () => {
  const { orcamentoAtual, removerItem, salvarRascunho } = useOrcamento();
  const { toast } = useToast();

  if (!orcamentoAtual || orcamentoAtual.itens.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <span className="text-primary">4.</span> Itens Adicionados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum item adicionado ainda.</p>
            <p className="text-sm mt-2">Adicione produtos ou serviços acima.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRemover = (id: string) => {
    console.log('Removendo item:', id);
    removerItem(id);
    salvarRascunho();
    toast({
      title: 'Item removido!',
      description: 'O item foi removido da lista.',
      variant: 'destructive'
    });
  };

  const subtotal = orcamentoAtual.itens.reduce((sum, item) => sum + item.valorTotal, 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span className="text-primary">4.</span> Itens Adicionados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Descrição</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Qtd</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Valor Unit.</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orcamentoAtual.itens.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {item.tipo === 'produto' ? (
                        <Package className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Wrench className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm capitalize">{item.tipo}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm">{item.nome}</td>
                  <td className="py-3 px-2 text-sm text-right">{item.quantidade}</td>
                  <td className="py-3 px-2 text-sm text-right">R$ {item.valorUnitario.toFixed(2)}</td>
                  <td className="py-3 px-2 text-sm text-right font-medium">R$ {item.valorTotal.toFixed(2)}</td>
                  <td className="py-3 px-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemover(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border">
                <td colSpan={4} className="py-3 px-2 text-right font-medium">Subtotal:</td>
                <td className="py-3 px-2 text-right font-bold text-primary text-lg">
                  R$ {subtotal.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};