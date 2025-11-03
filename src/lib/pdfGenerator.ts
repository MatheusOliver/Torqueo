import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Orcamento } from '@/types';
import { Configuracoes } from '@/types';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePDF = (orcamento: Orcamento, config: Configuracoes): Blob => {
  console.log('Gerando PDF profissional para orçamento:', orcamento.id);
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Cabeçalho com logo da oficina (se configurada)
  if (config.logoUrl) {
    try {
      // Detectar tipo de imagem
      let format = 'PNG';
      if (config.logoUrl.includes('data:image/jpeg') || config.logoUrl.includes('data:image/jpg')) {
        format = 'JPEG';
      } else if (config.logoUrl.includes('data:image/svg')) {
        format = 'SVG';
      }
      
      doc.addImage(config.logoUrl, format, 15, 10, 40, 25);
    } catch (error) {
      console.log('Erro ao carregar logo:', error);
    }
  }
  
  // Cabeçalho com gradiente - cores Torqueo
  doc.setFillColor(47, 108, 178); // #2f6cb2
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Título principal - Nome da Oficina
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(config.dadosEmpresa.nome, pageWidth / 2, 25, { align: 'center' });
  
  // Linha decorativa
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(15, 37, pageWidth - 15, 37);
  
  // Dados da Oficina (usando configurações)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  let yPos = 55;
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DA OFICINA', 15, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 5;
  doc.text(config.dadosEmpresa.nome, 15, yPos);
  doc.text(`CNPJ: ${config.dadosEmpresa.cnpj}`, 15, yPos + 4);
  doc.text(`Telefone: ${config.dadosEmpresa.telefone}`, 15, yPos + 8);
  doc.text(`Email: ${config.dadosEmpresa.email}`, 15, yPos + 12);
  doc.text(`Endereço: ${config.dadosEmpresa.endereco}`, 15, yPos + 16);
  
  // Info do Orçamento
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Data: ${orcamento.data}`, pageWidth - 15, 55, { align: 'right' });
  doc.text(`Orçamento Nº ${orcamento.id.slice(0, 8).toUpperCase()}`, pageWidth - 15, 60, { align: 'right' });
  
  yPos += 30;
  
  // Linha separadora
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(15, yPos, pageWidth - 15, yPos);
  
  yPos += 8;
  
  // Dados do Cliente - Box destacado
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, yPos, pageWidth - 30, 42, 2, 2, 'F');
  
  yPos += 5;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(47, 108, 178); // Cor Torqueo
  doc.text('DADOS DO CLIENTE', 20, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const clienteInfo = [
    `Nome: ${orcamento.cliente.nome}`,
    `CPF/CNPJ: ${orcamento.cliente.cpfCnpj}`,
    `Telefone: ${orcamento.cliente.telefone}`,
    orcamento.cliente.email ? `E-mail: ${orcamento.cliente.email}` : null,
    `Endereço: ${orcamento.cliente.endereco || 'Não informado'}`,
    `Veículo: ${orcamento.cliente.marca} ${orcamento.cliente.veiculo}`,
    `Placa: ${orcamento.cliente.placa || 'Não informado'}`,
    `KM Atual: ${orcamento.cliente.km || 'Não informado'}`
  ].filter(Boolean);
  
  clienteInfo.forEach(info => {
    if (info) {
      doc.text(info, 20, yPos);
      yPos += 5;
    }
  });
  
  yPos += 5;
  
  // Tabela de Itens
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PRODUTOS E SERVIÇOS', 15, yPos);
  
  yPos += 3;
  
  const tableData = orcamento.itens.map(item => [
    item.tipo === 'produto' ? '🔧 Produto' : '⚙️ Serviço',
    item.nome,
    item.quantidade.toString(),
    `R$ ${item.valorUnitario.toFixed(2)}`,
    `R$ ${item.valorTotal.toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Tipo', 'Descrição', 'Qtd', 'Valor Unit.', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [47, 108, 178], // Cor Torqueo
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 28, halign: 'center' },
      1: { cellWidth: 75 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Box de Totais
  const boxStartY = yPos;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(pageWidth - 95, boxStartY, 80, 30, 2, 2, 'F');
  
  yPos += 7;
  
  const subtotal = orcamento.itens.reduce((sum, item) => sum + item.valorTotal, 0);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  doc.text('Subtotal:', pageWidth - 90, yPos);
  doc.text(`R$ ${subtotal.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 7;
  doc.text('Mão de Obra:', pageWidth - 90, yPos);
  doc.text(`R$ ${orcamento.maoDeObra.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(47, 108, 178); // Cor Torqueo
  doc.text('TOTAL GERAL:', pageWidth - 90, yPos);
  doc.text(`R$ ${orcamento.total.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
  
  // Informações adicionais
  yPos += 15;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Validade da proposta: ${config.validadeOrcamento} dias`, 15, yPos);
  doc.text(`Garantia de Serviços: ${config.garantiaServicos}`, 15, yPos + 4);
  doc.text(`Garantia de Peças: ${config.garantiaPecas}`, 15, yPos + 8);
  
  // Rodapé
  const finalY = doc.internal.pageSize.height - 15;
  doc.setDrawColor(47, 108, 178); // Cor Torqueo
  doc.setLineWidth(0.5);
  doc.line(15, finalY - 5, pageWidth - 15, finalY - 5);
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Gerado automaticamente pelo sistema Torqueo', pageWidth / 2, finalY, { align: 'center' });
  
  console.log('PDF gerado com sucesso');
  return doc.output('blob');
};

export const downloadPDF = (orcamento: Orcamento, config: Configuracoes) => {
  const blob = generatePDF(orcamento, config);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `orcamento_${orcamento.cliente.nome.replace(/\s/g, '_')}_${orcamento.data.replace(/\//g, '-')}.pdf`;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  console.log('Download do PDF iniciado:', fileName);
};