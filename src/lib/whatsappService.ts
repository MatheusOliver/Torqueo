import { Orcamento } from '@/types';

export const sendWhatsApp = (orcamento: Orcamento, whatsappNumber: string) => {
  // Remover caracteres especiais do número (parênteses, espaços, hífen)
  const numeroLimpo = whatsappNumber.replace(/\D/g, '');
  // Adicionar código do país se não tiver
  const numeroCompleto = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
  
  const subtotal = orcamento.itens.reduce((sum, item) => sum + item.valorTotal, 0);
  
  const listaItens = orcamento.itens.map((item, index) => 
    `${index + 1}. ${item.tipo === 'produto' ? '🔧' : '⚙️'} ${item.nome} - ${item.quantidade}x R$ ${item.valorUnitario.toFixed(2)} = R$ ${item.valorTotal.toFixed(2)}`
  ).join('%0A');
  
  const mensagem = `*ORÇAMENTO - TORQUEO*%0A%0A` +
    `*Cliente:* ${orcamento.cliente.nome}%0A` +
    `*Veículo:* ${orcamento.cliente.marca} ${orcamento.cliente.veiculo}%0A` +
    `*KM:* ${orcamento.cliente.km || 'Não informado'}%0A%0A` +
    `*SERVIÇOS E PRODUTOS*%0A${listaItens}%0A%0A` +
    `*Subtotal:* R$ ${subtotal.toFixed(2)}%0A` +
    `*Mão de Obra:* R$ ${orcamento.maoDeObra.toFixed(2)}%0A` +
    `━━━━━━━━━━━━━━━━%0A` +
    `*TOTAL:* R$ ${orcamento.total.toFixed(2)}%0A%0A` +
    `⏰ Validade: 7 dias%0A` +
    `✅ Garantia conforme especificações`;
  
  const whatsappLink = `https://wa.me/${numeroCompleto}?text=${mensagem}`;
  
  console.log('Abrindo WhatsApp para:', numeroCompleto);
  window.open(whatsappLink, '_blank');
};