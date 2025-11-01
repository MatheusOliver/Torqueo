import { useState } from 'react';
import { useOrcamento } from '@/hooks/useOrcamento';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Save, MessageCircle, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { downloadPDF } from '@/lib/pdfGenerator';
import { sendWhatsApp } from '@/lib/whatsappService';
import { useNavigate } from 'react-router-dom';

export const GerarOrcamento = () => {
  const { orcamentoAtual, atualizarMaoDeObra, salvarRascunho, enviarOrcamento, criarNovoOrcamento, configuracoes } = useOrcamento();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [maoDeObra, setMaoDeObra] = useState('0');

  const handleMaoDeObraChange = (value: string) => {
    setMaoDeObra(value);
    atualizarMaoDeObra(Number(value) || 0);
  };

  const handleSalvarRascunho = () => {
    if (!orcamentoAtual) {
      toast({
        title: 'Erro!',
        description: 'Nenhum orçamento em andamento.',
        variant: 'destructive'
      });
      return;
    }

    if (!orcamentoAtual.cliente.nome || !orcamentoAtual.cliente.telefone) {
      toast({
        title: 'Atenção!',
        description: 'Preencha pelo menos nome e telefone do cliente.',
        variant: 'destructive'
      });
      return;
    }

    console.log('Salvando como rascunho');
    salvarRascunho();
    
    toast({
      title: 'Rascunho salvo!',
      description: 'O orçamento foi salvo em Rascunhos.',
    });

    setTimeout(() => {
      criarNovoOrcamento();
      setMaoDeObra('0');
      navigate('/rascunhos');
    }, 1000);
  };

  const handleBaixarPDF = () => {
    if (!orcamentoAtual) return;
    
    if (!orcamentoAtual.cliente.nome || !orcamentoAtual.cliente.telefone) {
      toast({
        title: 'Atenção!',
        description: 'Preencha os dados do cliente antes de gerar o orçamento.',
        variant: 'destructive'
      });
      return;
    }

    if (orcamentoAtual.itens.length === 0) {
      toast({
        title: 'Atenção!',
        description: 'Adicione pelo menos um item ao orçamento.',
        variant: 'destructive'
      });
      return;
    }

    console.log('Baixando PDF');
    downloadPDF(orcamentoAtual, configuracoes);
    
    toast({
      title: 'PDF gerado!',
      description: 'O arquivo está sendo baixado.',
    });
  };

  const handleEnviarWhatsApp = () => {
    if (!orcamentoAtual) return;
    
    if (!orcamentoAtual.cliente.nome || !orcamentoAtual.cliente.telefone) {
      toast({
        title: 'Atenção!',
        description: 'Preencha os dados do cliente incluindo o telefone.',
        variant: 'destructive'
      });
      return;
    }

    if (orcamentoAtual.itens.length === 0) {
      toast({
        title: 'Atenção!',
        description: 'Adicione pelo menos um item ao orçamento.',
        variant: 'destructive'
      });
      return;
    }

    if (!configuracoes.whatsappNumero) {
      toast({
        title: 'Atenção!',
        description: 'Configure o número do WhatsApp nas configurações.',
        variant: 'destructive'
      });
      return;
    }

    console.log('Enviando via WhatsApp');
    sendWhatsApp(orcamentoAtual, orcamentoAtual.cliente.telefone);
    
    enviarOrcamento(orcamentoAtual.id);
    
    toast({
      title: 'WhatsApp aberto!',
      description: 'O orçamento foi enviado para o cliente.',
      duration: 5000,
    });
    
    setTimeout(() => {
      criarNovoOrcamento();
      setMaoDeObra('0');
      navigate('/enviados');
    }, 1500);
  };

  const handlePreview = () => {
    if (!orcamentoAtual) return;
    
    if (!orcamentoAtual.cliente.nome) {
      toast({
        title: 'Atenção!',
        description: 'Preencha os dados do cliente antes de visualizar.',
        variant: 'destructive'
      });
      return;
    }

    navigate('/preview');
  };

  if (!orcamentoAtual) {
    return null;
  }

  const subtotal = orcamentoAtual.itens.reduce((sum, item) => sum + item.valorTotal, 0);

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
          <span className="text-primary">5.</span> Finalizar Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mao-obra" className="text-sm sm:text-base">Mão de Obra (R$)</Label>
            <Input
              id="mao-obra"
              type="number"
              min="0"
              step="0.01"
              value={maoDeObra}
              onChange={(e) => handleMaoDeObraChange(e.target.value)}
              placeholder="0.00"
              className="bg-input border-border text-foreground text-base sm:text-lg h-10 sm:h-12"
            />
          </div>
          
          <div className="flex flex-col justify-end">
            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 border border-border">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Subtotal: R$ {subtotal.toFixed(2)}</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">
                Total: R$ {orcamentoAtual.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <Button
            onClick={handleSalvarRascunho}
            variant="outline"
            className="w-full lg:flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 h-11 sm:h-12 text-base sm:text-lg font-semibold"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Salvar como Rascunho
          </Button>
          
          <Button
            onClick={handlePreview}
            variant="outline"
            className="w-full lg:flex-1 border-blue-500 text-blue-500 hover:bg-blue-500/10 h-11 sm:h-12 text-base sm:text-lg font-semibold"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Visualizar PDF
          </Button>
          
          <Button
            onClick={handleBaixarPDF}
            variant="outline"
            className="w-full lg:flex-1 border-primary text-primary hover:bg-primary/10 h-11 sm:h-12 text-base sm:text-lg font-semibold"
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Baixar PDF
          </Button>

          <Button
            onClick={handleEnviarWhatsApp}
            className="w-full lg:flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white h-11 sm:h-12 text-base sm:text-lg font-semibold"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Enviar WhatsApp
          </Button>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 leading-relaxed">
            <strong>📱 Instruções:</strong> O botão "Baixar PDF" gera o arquivo localmente. Use "Enviar WhatsApp" para enviar as informações do orçamento diretamente ao cliente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};