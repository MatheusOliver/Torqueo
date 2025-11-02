import { useOrcamento } from '@/hooks/useOrcamento';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { downloadPDF } from '@/lib/pdfGenerator';
import { useToast } from '@/components/ui/use-toast';

export const PreviewPDF = () => {
  const { orcamentoAtual, configuracoes } = useOrcamento();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!orcamentoAtual) {
    navigate('/');
    return null;
  }

  const handleDownload = () => {
    downloadPDF(orcamentoAtual, configuracoes);
    toast({
      title: 'PDF gerado!',
      description: 'O arquivo está sendo baixado.',
    });
  };


  const subtotal = orcamentoAtual.itens.reduce((sum, item) => sum + item.valorTotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pré-visualização do PDF</h1>
            <p className="text-muted-foreground mt-1">
              Confira como ficará o orçamento antes de gerar o arquivo
            </p>
          </div>
        </div>

                <Button
          onClick={handleDownload}
          className="bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar PDF
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-8">
          {/* Preview do PDF */}
          <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            {/* Cabeçalho */}
            <div className="bg-[#2f6cb2] text-white p-6 rounded-t-lg -mx-8 -mt-8 mb-6">
              <div className="flex items-center justify-between">
                {configuracoes.logoUrl && (
                  <div className="w-24 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                    <img src={configuracoes.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">TORQUEO</h1>
                  <p className="text-sm">Sistema de Orçamentos para Oficinas</p>
                </div>
              </div>
            </div>

            {/* Informações da Oficina e Orçamento */}
            <div className="flex justify-between mb-6 text-sm">
              <div>
                <p className="font-bold mb-1 text-[#2f6cb2]">DADOS DA OFICINA</p>
                <p>{configuracoes.dadosEmpresa.nome}</p>
                <p>CNPJ: {configuracoes.dadosEmpresa.cnpj}</p>
                <p>Telefone: {configuracoes.dadosEmpresa.telefone}</p>
                <p>Email: {configuracoes.dadosEmpresa.email}</p>
                <p>{configuracoes.dadosEmpresa.endereco}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Data: {orcamentoAtual.data}</p>
                <p className="font-bold">Orçamento Nº {orcamentoAtual.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>

            <hr className="my-6" />

            {/* Dados do Cliente */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-3 text-[#2f6cb2]">DADOS DO CLIENTE</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Nome:</strong> {orcamentoAtual.cliente.nome}</p>
                <p><strong>CPF/CNPJ:</strong> {orcamentoAtual.cliente.cpfCnpj}</p>
                <p><strong>Telefone:</strong> {orcamentoAtual.cliente.telefone}</p>
                <p><strong>E-mail:</strong> {orcamentoAtual.cliente.email || 'Não informado'}</p>
                <p className="col-span-2"><strong>Endereço:</strong> {orcamentoAtual.cliente.endereco || 'Não informado'}</p>
                <p><strong>Veículo:</strong> {orcamentoAtual.cliente.marca} {orcamentoAtual.cliente.veiculo}</p>
                <p><strong>Placa:</strong> {orcamentoAtual.cliente.placa || 'Não informado'}</p>
                <p><strong>KM Atual:</strong> {orcamentoAtual.cliente.km || 'Não informado'}</p>
              </div>
            </div>

            {/* Tabela de Itens */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-[#2f6cb2]">PRODUTOS E SERVIÇOS</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#2f6cb2] text-white">
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Descrição</th>
                    <th className="p-2 text-center">Qtd</th>
                    <th className="p-2 text-right">Valor Unit.</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamentoAtual.itens.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-2">{item.tipo === 'produto' ? '🔧 Produto' : '⚙️ Serviço'}</td>
                      <td className="p-2">{item.nome}</td>
                      <td className="p-2 text-center">{item.quantidade}</td>
                      <td className="p-2 text-right">R$ {item.valorUnitario.toFixed(2)}</td>
                      <td className="p-2 text-right font-bold">R$ {item.valorTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totais */}
            <div className="bg-gray-100 p-4 rounded-lg ml-auto max-w-xs">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span>Mão de Obra:</span>
                <span>R$ {orcamentoAtual.maoDeObra.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-[#2f6cb2] border-t-2 border-[#2f6cb2] pt-2">
                <span>TOTAL GERAL:</span>
                <span>R$ {orcamentoAtual.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Informações Finais */}
            <div className="mt-6 text-xs text-gray-600">
              <p>Validade do orçamento: {configuracoes.validadeOrcamento} dias</p>
              <p>Garantia de Serviços: {configuracoes.garantiaServicos}</p>
              <p>Garantia de Peças: {configuracoes.garantiaPecas}</p>
            </div>

            {/* Rodapé */}
            <div className="mt-6 pt-4 border-t-2 border-[#2f6cb2] text-center text-xs text-gray-500 italic">
              Gerado automaticamente pelo sistema Torqueo
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};