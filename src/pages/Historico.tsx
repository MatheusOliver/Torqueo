import { useOrcamento } from '@/hooks/useOrcamento';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, CheckCircle, XCircle, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { downloadPDF } from '@/lib/pdfGenerator';
import { sendWhatsApp } from '@/lib/whatsappService';

export const Historico = () => {
  const { orcamentos, configuracoes } = useOrcamento();
  const { toast } = useToast();

  const historico = orcamentos.filter(o => o.status === 'finalizado' || o.status === 'cancelado');

    const handleBaixarPDF = (orcamento: any) => {
    console.log('Baixando PDF:', orcamento.id);
    downloadPDF(orcamento, configuracoes);
    toast({
      title: 'Download iniciado!',
      description: 'O PDF está sendo baixado.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
          <History className="w-10 h-10 text-purple-500" />
          Histórico
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Todos os orçamentos finalizados e cancelados
        </p>
      </div>

      {historico.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12">
            <div className="text-center">
              <History className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum histórico encontrado</h3>
              <p className="text-muted-foreground">
                Os orçamentos finalizados e cancelados aparecerão aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {historico.map((orcamento) => (
            <Card key={orcamento.id} className="bg-card border-border hover:border-purple-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {orcamento.cliente.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground">{orcamento.data}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    orcamento.status === 'finalizado'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {orcamento.status === 'finalizado' ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Finalizado
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Cancelado
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Veículo:</span>
                    <span className="font-medium">{orcamento.cliente.marca} {orcamento.cliente.veiculo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Itens:</span>
                    <span className="font-medium">{orcamento.itens.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className={`font-bold ${
                      orcamento.status === 'finalizado' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      R$ {orcamento.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                                <Button
                  onClick={() => handleBaixarPDF(orcamento)}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Baixar PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};