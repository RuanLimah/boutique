import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Package } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useProducts } from '@/context/ProductContext';
import { Product, ProductCategory, categoryLabels } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Import product images for display
import floralImg from '@/assets/perfume-floral.jpg';
import vanillaImg from '@/assets/perfume-vanilla.jpg';
import citrusImg from '@/assets/perfume-citrus.jpg';
import woodyImg from '@/assets/perfume-woody.jpg';

const categoryImages: Record<string, string> = {
  floral: floralImg,
  doce: vanillaImg,
  citrico: citrusImg,
  amadeirado: woodyImg,
};

type ProductFormData = Omit<Product, 'id' | 'slug'>;

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  shortDescription: '',
  price: 0,
  category: 'floral',
  image: '/placeholder.svg',
  stock: 0,
  featured: false,
};

const AdminPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = Object.entries(categoryLabels) as [ProductCategory, string][];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCategoryChange = (value: ProductCategory) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleFeaturedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      featured: product.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!formData.shortDescription.trim()) {
      toast.error('Descrição curta é obrigatória');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }

    setIsDialogOpen(false);
    setFormData(initialFormData);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <Layout title="Painel Administrativo - Essência Feminina">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os produtos da loja
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="btn-gold gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome do perfume"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortDescription">Descrição curta</Label>
                  <Input
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Notas principais do perfume"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição completa</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descrição detalhada do perfume"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Estoque</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={handleFeaturedChange}
                    />
                    <Label htmlFor="featured">Destaque</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="btn-primary gap-2">
                    <Save className="w-4 h-4" />
                    {editingProduct ? 'Salvar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="hidden sm:table-cell">Estoque</TableHead>
                  <TableHead className="hidden lg:table-cell">Destaque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum produto cadastrado
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary/30">
                          <img
                            src={categoryImages[product.category] || floralImg}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 md:hidden">
                            {categoryLabels[product.category]}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {categoryLabels[product.category]}
                      </TableCell>
                      <TableCell>
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={product.stock <= 5 ? 'text-amber-600' : ''}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {product.featured ? (
                          <span className="text-primary">Sim</span>
                        ) : (
                          <span className="text-muted-foreground">Não</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          
                          {deleteConfirm === product.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                              >
                                Confirmar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirm(null)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteConfirm(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <p className="text-muted-foreground text-sm">Total de Produtos</p>
            <p className="text-3xl font-bold text-foreground mt-1">{products.length}</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <p className="text-muted-foreground text-sm">Produtos em Destaque</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {products.filter(p => p.featured).length}
            </p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <p className="text-muted-foreground text-sm">Estoque Baixo</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {products.filter(p => p.stock <= 5).length}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
