import { Orcamento, Cliente } from '@/types';

const STORAGE_KEY = 'oficina_facil_orcamentos';
const CLIENTES_KEY = 'torqueo_clientes';

export const storageService = {
  getOrcamentos: (): Orcamento[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      return [];
    }
  },

  saveOrcamentos: (orcamentos: Orcamento[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orcamentos));
      console.log('Orçamentos salvos com sucesso:', orcamentos.length);
    } catch (error) {
      console.error('Erro ao salvar orçamentos:', error);
    }
  },

  addOrcamento: (orcamento: Orcamento): void => {
    const orcamentos = storageService.getOrcamentos();
    orcamentos.push(orcamento);
    storageService.saveOrcamentos(orcamentos);
  },

  updateOrcamento: (id: string, orcamento: Orcamento): void => {
    const orcamentos = storageService.getOrcamentos();
    const index = orcamentos.findIndex(o => o.id === id);
    if (index !== -1) {
      orcamentos[index] = orcamento;
      storageService.saveOrcamentos(orcamentos);
    }
  },

  deleteOrcamento: (id: string): void => {
    const orcamentos = storageService.getOrcamentos();
    const filtered = orcamentos.filter(o => o.id !== id);
    storageService.saveOrcamentos(filtered);
  },

  // Gestão de Clientes
  getClientes: (): Cliente[] => {
    try {
      const data = localStorage.getItem(CLIENTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      return [];
    }
  },

  saveClientes: (clientes: Cliente[]): void => {
    try {
      localStorage.setItem(CLIENTES_KEY, JSON.stringify(clientes));
      console.log('Clientes salvos com sucesso:', clientes.length);
    } catch (error) {
      console.error('Erro ao salvar clientes:', error);
    }
  },

  addCliente: (cliente: Cliente): void => {
    const clientes = storageService.getClientes();
    // Verificar se já existe (por CPF/CNPJ)
    const existente = clientes.find(c => c.cpfCnpj === cliente.cpfCnpj);
    if (!existente) {
      clientes.push(cliente);
      storageService.saveClientes(clientes);
    }
  },

  buscarClientes: (termo: string): Cliente[] => {
    const clientes = storageService.getClientes();
    const termoLower = termo.toLowerCase();
    return clientes.filter(c => 
      c.nome.toLowerCase().includes(termoLower) ||
      c.cpfCnpj.includes(termo) ||
      c.telefone.includes(termo)
    );
  }
};