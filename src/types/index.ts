export interface Cliente {
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  marca: string;
  veiculo: string;
  placa: string;
  km: string;
}

export interface ItemOrcamento {
  id: string;
  tipo: 'produto' | 'servico';
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Orcamento {
  id: string;
  data: string;
  cliente: Cliente;
  itens: ItemOrcamento[];
  maoDeObra: number;
  total: number;
  status: 'rascunho' | 'enviado' | 'em_andamento' | 'finalizado' | 'cancelado';
}

export interface DadosEmpresa {
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
}

export interface WhatsAppConfig {
  instanceKey: string;
  apiUrl: string;
}

export interface Configuracoes {
  logoUrl: string;
  whatsappNumero: string;
  mensagemPadrao: string;
  validadeOrcamento: number;
  garantiaServicos: string;
  garantiaPecas: string;
  dadosEmpresa: DadosEmpresa;
  whatsappApi: WhatsAppConfig;
  tema: 'light' | 'dark';
}

export interface OrcamentoContextType {
  orcamentos: Orcamento[];
  orcamentoAtual: Orcamento | null;
  configuracoes: Configuracoes;
  clientes: Cliente[];
  criarNovoOrcamento: () => void;
  atualizarCliente: (cliente: Cliente) => void;
  adicionarItem: (item: Omit<ItemOrcamento, 'id' | 'valorTotal'>) => void;
  removerItem: (id: string) => void;
  atualizarMaoDeObra: (valor: number) => void;
  salvarRascunho: () => void;
  enviarOrcamento: (id: string) => void;
  carregarOrcamento: (id: string) => void;
  excluirOrcamento: (id: string) => void;
  moverParaEmAndamento: (id: string) => void;
  moverParaCancelado: (id: string) => void;
  finalizarOrcamento: (id: string) => void;
  atualizarConfiguracoes: (config: Configuracoes) => void;
  buscarCliente: (termo: string) => Cliente[];
}