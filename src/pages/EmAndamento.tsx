import { useOrcamento } from '@/hooks/useOrcamento';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, MessageCircle, CheckCircle, Clock, Eye, Package, Wrench } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { downloadPDF } from '@/lib/pdfGenerator';
import { sendWhatsApp } from '@/lib/whatsappService';

export const EmAndamento = () => {
  const { orcamentos, configuracoes, finalizarOrcamento } = useOrcamento();
  const { toast } = useToast();

  const emAndamento = orcamentos.filter(o => o.status === 'em_andamento');

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

    const handleFinalizar = (id: string) => {
    console.log('Finalizando orçamento:', id);
    finalizarOrcamento(id);
    toast({
      title: 'Orçamento finalizado!',
      description: 'O orçamento foi movido para o histórico.',
    });
    // Forçar re-render
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Clock className="w-10 h-10 text-blue-500" />
          Em Andamento
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Orçamentos aprovados que estão sendo executados
        </p>
      </div>

      {emAndamento.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12">
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum orçamento em andamento</h3>
              <p className="text-muted-foreground">
                Os orçamentos aprovados aparecerão aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emAndamento.map((orcamento) => (
            <Card key={orcamento.id} className="bg-card border-border hover:border-blue-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {orcamento.cliente.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground">{orcamento.data}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Em Andamento
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
                    <span className="font-bold text-blue-500">R$ {orcamento.total.toFixed(2)}</span>
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
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10 mb-2"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalhes do Orçamento</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Dados do Cliente */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg mb-3">Dados do Cliente</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Nome:</span>
                              <p className="font-medium">{orcamento.cliente.nome}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CPF/CNPJ:</span>
                              <p className="font-medium">{orcamento.cliente.cpfCnpj}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Telefone:</span>
                              <p className="font-medium">{orcamento.cliente.telefone}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Veículo:</span>
                              <p className="font-medium">{orcamento.cliente.marca} {orcamento.cliente.veiculo}</p>
                            </div>
                            {orcamento.cliente.km && (
                              <div>
                                <span className="text-muted-foreground">KM:</span>
                                <p className="font-medium">{orcamento.cliente.km}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Lista de Itens */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Produtos e Serviços</h3>
                          <div className="space-y-2">
                            {orcamento.itens.map((item, index) => (
                              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-3 flex-1">
                                  {item.tipo === 'produto' ? (
                                    <Package className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                  ) : (
                                    <Wrench className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium">{item.nome}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.quantidade}x R$ {item.valorUnitario.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-primary">
                                    R$ {item.valorTotal.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Totais */}
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Subtotal:</span>
                              <span>R$ {orcamento.itens.reduce((sum, item) => sum + item.valorTotal, 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Mão de Obra:</span>
                              <span>R$ {orcamento.maoDeObra.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                              <span>TOTAL:</span>
                              <span>R$ {orcamento.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    onClick={() => handleFinalizar(orcamento.id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Finalizar
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