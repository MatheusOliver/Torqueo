import { useOrcamento } from '@/hooks/useOrcamento';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { downloadPDF } from '@/lib/pdfGenerator';
import { sendWhatsApp } from '@/lib/whatsappService';

export const Enviados = () => {
  const { orcamentos, configuracoes, moverParaEmAndamento, moverParaCancelado } = useOrcamento();
  const { toast } = useToast();

  // Ordenar por ID (timestamp) - mais recentes primeiro
  const enviados = orcamentos
    .filter(o => o.status === 'enviado')
    .sort((a, b) => Number(b.id) - Number(a.id));

  const handleBaixarPDF = (orcamento: any) => {
    console.log('Baixando PDF:', orcamento.id);
    downloadPDF(orcamento, configuracoes);
    toast({
      title: 'Download iniciado!',
      description: 'O PDF está sendo baixado.',
    });
  };

  const handleReenviar = (orcamento: any) => {
    console.log('Reenviando via WhatsApp:', orcamento.id);
    sendWhatsApp(orcamento, orcamento.cliente.telefone);
    toast({
      title: 'WhatsApp aberto!',
      description: 'Você pode reenviar o orçamento agora.',
    });
  };

    const handleAprovar = (id: string) => {
    console.log('Aprovando orçamento:', id);
    moverParaEmAndamento(id);
    toast({
      title: 'Orçamento aprovado!',
      description: 'O orçamento foi movido para Em Andamento.',
    });
    // Forçar re-render
    setTimeout(() => window.location.reload(), 500);
  };

  const handleCancelar = (id: string) => {
    if (window.confirm('Deseja realmente cancelar este orçamento?')) {
      console.log('Cancelando orçamento:', id);
      moverParaCancelado(id);
      toast({
        title: 'Orçamento cancelado!',
        description: 'O orçamento foi movido para o histórico.',
        variant: 'destructive'
      });
      // Forçar re-render
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">Enviados</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Orçamentos finalizados e enviados aos clientes
        </p>
      </div>

      {enviados.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum orçamento enviado</h3>
              <p className="text-muted-foreground">
                Quando você gerar e enviar orçamentos, eles aparecerão aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enviados.map((orcamento) => (
            <Card key={orcamento.id} className="bg-card border-border hover:border-green-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {orcamento.cliente.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground">{orcamento.data}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Enviado
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Veículo:</span>
                    <span className="font-medium">{orcamento.cliente.marca} {orcamento.cliente.veiculo}</span>
                  </div>
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
                    <span className="font-bold text-green-500">R$ {orcamento.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleBaixarPDF(orcamento)}
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary/10"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button
                      onClick={() => handleReenviar(orcamento)}
                      variant="outline"
                      className="flex-1 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAprovar(orcamento.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => handleCancelar(orcamento.id)}
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};