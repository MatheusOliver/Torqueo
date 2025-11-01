import React, { createContext, useContext, useState, useEffect } from 'react';
import { Orcamento, OrcamentoContextType, Cliente, ItemOrcamento, Configuracoes } from '@/types';
import { storageService } from '@/lib/storage';

const OrcamentoContext = createContext<OrcamentoContextType | undefined>(undefined);

const defaultConfiguracoes: Configuracoes = {
  logoUrl: 'https://cdn-ai.onspace.ai/onspace/project/image/PHFKscnXvNiErZvXWg4gGJ/Grupo_2.svg',
  whatsappNumero: '',
  mensagemPadrao: 'Olá! Segue o orçamento solicitado para os serviços em seu veículo. Qualquer dúvida, estamos à disposição!',
  validadeOrcamento: 7,
  garantiaServicos: '90 dias',
  garantiaPecas: 'Conforme fabricante',
  dadosEmpresa: {
    nome: 'Oficina Exemplo Ltda',
    cnpj: '00.000.000/0001-00',
    endereco: 'Rua Exemplo, 123 - Centro',
    telefone: '(00) 0000-0000',
    email: 'contato@oficinaexemplo.com.br'
  },
  whatsappApi: {
    instanceKey: '',
    apiUrl: ''
  },
  tema: 'dark'
};

export const OrcamentoProvider = ({ children }: { children: React.ReactNode }) => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [orcamentoAtual, setOrcamentoAtual] = useState<Orcamento | null>(null);
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>(defaultConfiguracoes);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    console.log('Carregando orçamentos do localStorage');
    const loaded = storageService.getOrcamentos();
    setOrcamentos(loaded);
    
    const loadedClientes = storageService.getClientes();
    setClientes(loadedClientes);
    
    const savedConfig = localStorage.getItem('torqueo_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Fazer merge com configurações padrão para garantir que todos os campos existam
        const merged = {
          ...defaultConfiguracoes,
          ...parsed,
          dadosEmpresa: {
            ...defaultConfiguracoes.dadosEmpresa,
            ...(parsed.dadosEmpresa || {})
          },
          whatsappApi: {
            ...defaultConfiguracoes.whatsappApi,
            ...(parsed.whatsappApi || {})
          }
        };
        setConfiguracoes(merged);
      } catch (error) {
        console.error('Erro ao carregar configurações, usando padrão:', error);
        setConfiguracoes(defaultConfiguracoes);
      }
    }
  }, []);

  useEffect(() => {
    if (orcamentos.length > 0) {
      console.log('Salvando orçamentos no localStorage:', orcamentos.length);
      storageService.saveOrcamentos(orcamentos);
    }
  }, [orcamentos]);

  const criarNovoOrcamento = () => {
    console.log('Criando novo orçamento');
    const hoje = new Date().toLocaleDateString('pt-BR');
    const novoOrcamento: Orcamento = {
      id: Date.now().toString(),
      data: hoje,
      cliente: {
        nome: '',
        cpfCnpj: '',
        telefone: '',
        email: '',
        endereco: '',
        marca: '',
        veiculo: '',
        km: ''
      },
      itens: [],
      maoDeObra: 0,
      total: 0,
      status: 'rascunho'
    };
    
    setOrcamentoAtual(novoOrcamento);
  };

  const atualizarCliente = (cliente: Cliente) => {
    if (!orcamentoAtual) return;
    
    console.log('Atualizando dados do cliente');
    const atualizado = { ...orcamentoAtual, cliente };
    setOrcamentoAtual(atualizado);
    
    // Salvar cliente no histórico
    storageService.addCliente(cliente);
    setClientes(storageService.getClientes());
  };

  const adicionarItem = (item: Omit<ItemOrcamento, 'id' | 'valorTotal'>) => {
    if (!orcamentoAtual) return;
    
    console.log('Adicionando item ao orçamento:', item);
    const novoItem: ItemOrcamento = {
      ...item,
      id: Date.now().toString(),
      valorTotal: item.quantidade * item.valorUnitario
    };
    
    const novosItens = [...orcamentoAtual.itens, novoItem];
    const subtotal = novosItens.reduce((sum, i) => sum + i.valorTotal, 0);
    const total = subtotal + orcamentoAtual.maoDeObra;
    
    setOrcamentoAtual({
      ...orcamentoAtual,
      itens: novosItens,
      total
    });
  };

  const removerItem = (id: string) => {
    if (!orcamentoAtual) return;
    
    console.log('Removendo item:', id);
    const novosItens = orcamentoAtual.itens.filter(item => item.id !== id);
    const subtotal = novosItens.reduce((sum, i) => sum + i.valorTotal, 0);
    const total = subtotal + orcamentoAtual.maoDeObra;
    
    setOrcamentoAtual({
      ...orcamentoAtual,
      itens: novosItens,
      total
    });
  };

  const atualizarMaoDeObra = (valor: number) => {
    if (!orcamentoAtual) return;
    
    console.log('Atualizando mão de obra:', valor);
    const subtotal = orcamentoAtual.itens.reduce((sum, i) => sum + i.valorTotal, 0);
    const total = subtotal + valor;
    
    setOrcamentoAtual({
      ...orcamentoAtual,
      maoDeObra: valor,
      total
    });
  };

  const salvarRascunho = () => {
    if (!orcamentoAtual) return;
    
    console.log('Salvando rascunho');
    const existe = orcamentos.find(o => o.id === orcamentoAtual.id);
    
    if (existe) {
      setOrcamentos(orcamentos.map(o => 
        o.id === orcamentoAtual.id ? orcamentoAtual : o
      ));
    } else {
      setOrcamentos([...orcamentos, orcamentoAtual]);
    }
  };

  const enviarOrcamento = (id: string) => {
    console.log('Enviando orçamento:', id);
    setOrcamentos(orcamentos.map(o => 
      o.id === id ? { ...o, status: 'enviado' as const } : o
    ));
    
    if (orcamentoAtual?.id === id) {
      setOrcamentoAtual({ ...orcamentoAtual, status: 'enviado' });
    }
  };

  const moverParaEmAndamento = (id: string) => {
    console.log('Movendo para Em Andamento:', id);
    setOrcamentos(orcamentos.map(o => 
      o.id === id ? { ...o, status: 'em_andamento' as const } : o
    ));
  };

  const moverParaCancelado = (id: string) => {
    console.log('Cancelando orçamento:', id);
    setOrcamentos(orcamentos.map(o => 
      o.id === id ? { ...o, status: 'cancelado' as const } : o
    ));
  };

  const finalizarOrcamento = (id: string) => {
    console.log('Finalizando orçamento:', id);
    setOrcamentos(orcamentos.map(o => 
      o.id === id ? { ...o, status: 'finalizado' as const } : o
    ));
  };

  const carregarOrcamento = (id: string) => {
    console.log('Carregando orçamento:', id);
    const orcamento = orcamentos.find(o => o.id === id);
    if (orcamento) {
      setOrcamentoAtual(orcamento);
    }
  };

  const excluirOrcamento = (id: string) => {
    console.log('Excluindo orçamento:', id);
    setOrcamentos(orcamentos.filter(o => o.id !== id));
    if (orcamentoAtual?.id === id) {
      setOrcamentoAtual(null);
    }
  };

  const atualizarConfiguracoes = (config: Configuracoes) => {
    console.log('Atualizando configurações');
    setConfiguracoes(config);
    localStorage.setItem('torqueo_config', JSON.stringify(config));
    
    // Aplicar tema
    if (config.tema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const buscarCliente = (termo: string): Cliente[] => {
    return storageService.buscarClientes(termo);
  };

  return (
    <OrcamentoContext.Provider
      value={{
        orcamentos,
        orcamentoAtual,
        configuracoes,
        clientes,
        criarNovoOrcamento,
        atualizarCliente,
        adicionarItem,
        removerItem,
        atualizarMaoDeObra,
        salvarRascunho,
        enviarOrcamento,
        carregarOrcamento,
        excluirOrcamento,
        moverParaEmAndamento,
        moverParaCancelado,
        finalizarOrcamento,
        atualizarConfiguracoes,
        buscarCliente
      }}
    >
      {children}
    </OrcamentoContext.Provider>
  );
};

export const useOrcamento = () => {
  const context = useContext(OrcamentoContext);
  if (!context) {
    throw new Error('useOrcamento deve ser usado dentro de OrcamentoProvider');
  }
  return context;
};