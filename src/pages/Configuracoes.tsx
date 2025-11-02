import { useState, useEffect, useRef } from 'react';
import { useOrcamento } from '@/hooks/useOrcamento';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Settings, Moon, Sun, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Configuracoes as ConfigType } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Configuracoes = () => {
  const { configuracoes, atualizarConfiguracoes } = useOrcamento();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ConfigType>(configuracoes);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    setFormData(configuracoes);
    setLogoPreview(configuracoes.logoUrl);
  }, [configuracoes]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar se é PNG
      if (!file.type.includes('png')) {
        toast({
          title: 'Formato inválido',
          description: 'Por favor, selecione uma imagem PNG.',
          variant: 'destructive'
        });
        return;
      }

      // Converter para base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, logoUrl: base64String }));
        setLogoPreview(base64String);
        toast({
          title: 'Logo carregada!',
          description: 'A logo foi carregada com sucesso.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando configurações:', formData);
    
    atualizarConfiguracoes(formData);
    
    toast({
      title: 'Configurações salvas!',
      description: 'Suas preferências foram atualizadas com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Settings className="w-10 h-10 text-primary" />
          Configurações
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Personalize o sistema e configure as informações da oficina
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tema */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl flex items-center gap-2">
              {formData.tema === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Tema do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="tema" className="text-base font-semibold">Aparência</Label>
              <Select
                value={formData.tema}
                onValueChange={(value: 'light' | 'dark') => 
                  setFormData(prev => ({ ...prev, tema: value }))
                }
              >
                <SelectTrigger className="w-full bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Claro
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Escuro
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dados da Empresa */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">Dados da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nomeEmpresa" className="text-base font-semibold">Nome da Empresa *</Label>
                <Input
                  id="nomeEmpresa"
                  value={formData.dadosEmpresa.nome}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dadosEmpresa: { ...prev.dadosEmpresa, nome: e.target.value }
                  }))}
                  placeholder="Oficina Exemplo Ltda"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="cnpj" className="text-base font-semibold">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.dadosEmpresa.cnpj}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dadosEmpresa: { ...prev.dadosEmpresa, cnpj: e.target.value }
                  }))}
                  placeholder="00.000.000/0001-00"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="telefoneEmpresa" className="text-base font-semibold">Telefone *</Label>
                <Input
                  id="telefoneEmpresa"
                  value={formData.dadosEmpresa.telefone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dadosEmpresa: { ...prev.dadosEmpresa, telefone: e.target.value }
                  }))}
                  placeholder="(00) 0000-0000"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="emailEmpresa" className="text-base font-semibold">E-mail *</Label>
                <Input
                  id="emailEmpresa"
                  type="email"
                  value={formData.dadosEmpresa.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dadosEmpresa: { ...prev.dadosEmpresa, email: e.target.value }
                  }))}
                  placeholder="contato@oficinaexemplo.com.br"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="enderecoEmpresa" className="text-base font-semibold">Endereço *</Label>
                <Input
                  id="enderecoEmpresa"
                  value={formData.dadosEmpresa.endereco}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dadosEmpresa: { ...prev.dadosEmpresa, endereco: e.target.value }
                  }))}
                  placeholder="Rua Exemplo, 123 - Centro"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Orçamento */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">Configurações de Orçamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Logo da Oficina (PNG)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Carregue a logo que aparecerá nos PDFs gerados (formato PNG)
              </p>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Logo PNG
                </Button>
                {logoPreview && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 border border-border rounded-lg overflow-hidden bg-white flex items-center justify-center">
                      <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                    <span className="text-sm text-green-500 flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      Logo carregada
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="validadeOrcamento" className="text-base font-semibold">Validade (dias) *</Label>
                <Input
                  id="validadeOrcamento"
                  type="number"
                  min="1"
                  value={formData.validadeOrcamento}
                  onChange={(e) => setFormData(prev => ({ ...prev, validadeOrcamento: Number(e.target.value) }))}
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="garantiaServicos" className="text-base font-semibold">Garantia Serviços *</Label>
                <Input
                  id="garantiaServicos"
                  value={formData.garantiaServicos}
                  onChange={(e) => setFormData(prev => ({ ...prev, garantiaServicos: e.target.value }))}
                  placeholder="Ex: 90 dias"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="garantiaPecas" className="text-base font-semibold">Garantia Peças *</Label>
                <Input
                  id="garantiaPecas"
                  value={formData.garantiaPecas}
                  onChange={(e) => setFormData(prev => ({ ...prev, garantiaPecas: e.target.value }))}
                  placeholder="Ex: Conforme fabricante"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de WhatsApp */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">Configurações de WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whatsappNumero" className="text-base font-semibold">Número do WhatsApp *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Número com DDD (Ex: (11) 99999-9999 ou 11999999999)
              </p>
              <Input
                id="whatsappNumero"
                value={formData.whatsappNumero}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumero: e.target.value }))}
                placeholder="(11) 99999-9999"
                required
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h3 className="font-semibold text-lg mb-4 text-foreground">API do WhatsApp Business</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure a API do WhatsApp para envio automático de mensagens
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="instanceKey" className="text-base font-semibold">Instance Key</Label>
                  <Input
                    id="instanceKey"
                    value={formData.whatsappApi.instanceKey}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      whatsappApi: { ...prev.whatsappApi, instanceKey: e.target.value }
                    }))}
                    placeholder="sua_instance_key"
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="apiUrl" className="text-base font-semibold">URL da API</Label>
                  <Input
                    id="apiUrl"
                    type="url"
                    value={formData.whatsappApi.apiUrl}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      whatsappApi: { ...prev.whatsappApi, apiUrl: e.target.value }
                    }))}
                    placeholder="https://api.exemplo.com"
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white">
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </form>
    </div>
  );
};
