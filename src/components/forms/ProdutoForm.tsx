import { useState } from 'react';
import { useOrcamento } from '@/hooks/useOrcamento';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const ProdutoForm = () => {
  const { adicionarItem, salvarRascunho } = useOrcamento();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    valorUnitario: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adicionando produto:', formData);
    
    adicionarItem({
      tipo: 'produto',
      nome: formData.nome,
      quantidade: Number(formData.quantidade),
      valorUnitario: Number(formData.valorUnitario)
    });
    
    salvarRascunho();
    
    setFormData({ nome: '', quantidade: '', valorUnitario: '' });
    
    toast({
      title: 'Produto adicionado!',
      description: 'O produto foi adicionado à lista.',
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span className="text-primary">2.</span> Adicionar Produtos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="produto-nome">Nome do Produto</Label>
              <Input
                id="produto-nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Óleo 5W30"
                required
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="produto-qtd">Quantidade</Label>
              <Input
                id="produto-qtd"
                type="number"
                min="1"
                step="1"
                value={formData.quantidade}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
                placeholder="1"
                required
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="produto-valor">Valor Unitário (R$)</Label>
              <Input
                id="produto-valor"
                type="number"
                min="0"
                step="0.01"
                value={formData.valorUnitario}
                onChange={(e) => setFormData(prev => ({ ...prev, valorUnitario: e.target.value }))}
                placeholder="0.00"
                required
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};