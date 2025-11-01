import { useState, useEffect } from 'react';
import { Cliente } from '@/types';
import { useOrcamento } from '@/hooks/useOrcamento';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const ClienteForm = () => {
  const { orcamentoAtual, atualizarCliente, salvarRascunho } = useOrcamento();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Cliente>({
    nome: '',
    cpfCnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    marca: '',
    veiculo: '',
    km: ''
  });

  useEffect(() => {
    if (orcamentoAtual?.cliente) {
      setFormData(orcamentoAtual.cliente);
    }
  }, [orcamentoAtual]);

  const handleChange = (field: keyof Cliente, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando dados do cliente:', formData);
    
    atualizarCliente(formData);
    salvarRascunho();
    
    toast({
      title: 'Dados salvos!',
      description: 'Os dados do cliente foram salvos com sucesso.',
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground text-xl">
          <span className="text-primary">1.</span> Dados do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome" className="text-sm sm:text-base">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Ex: João Silva"
                required
                className="bg-input border-border text-foreground text-base h-10 sm:h-11"
              />
            </div>
            
            <div>
              <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
              <Input
                id="cpfCnpj"
                value={formData.cpfCnpj}
                onChange={(e) => handleChange('cpfCnpj', e.target.value)}
                placeholder="000.000.000-00"
                required
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div>
                            <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
                required
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="cliente@exemplo.com"
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                placeholder="Rua, número, bairro, cidade"
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="marca">Marca do Veículo *</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => handleChange('marca', e.target.value)}
                placeholder="Ex: Volkswagen"
                required
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="veiculo">Modelo do Veículo *</Label>
              <Input
                id="veiculo"
                value={formData.veiculo}
                onChange={(e) => handleChange('veiculo', e.target.value)}
                placeholder="Ex: Gol G5"
                required
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="km">KM Atual</Label>
              <Input
                id="km"
                value={formData.km}
                onChange={(e) => handleChange('km', e.target.value)}
                placeholder="Ex: 50000"
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Dados do Cliente
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};