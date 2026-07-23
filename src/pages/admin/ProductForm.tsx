import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminCreateProduct, useListCategories } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminProductForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createMutation = useAdminCreateProduct();
  const { data: categories } = useListCategories();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isLimitedEdition: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast({ title: "Please select a category", variant: "destructive" });
      return;
    }

    createMutation.mutate({
      data: {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        inStock: formData.inStock,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        isLimitedEdition: formData.isLimitedEdition,
        images: [], // Handled by separate upload usually, empty for now
        availableSizes: ["OS"],
        availableColors: ["Default"]
      }
    }, {
      onSuccess: () => {
        toast({ title: "Product created" });
        setLocation("/admin/products");
      },
      onError: () => {
        toast({ title: "Error creating product", variant: "destructive" });
      }
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-12 border-b border-border pb-6">
          <h1 className="font-serif text-4xl">New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="bg-white border border-border p-8 flex flex-col gap-6">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] mb-2 border-b border-border pb-2">Basic Info</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-foreground" 
                />
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">Price ($)</label>
                <input 
                  type="number" 
                  required 
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-foreground" 
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">Category</label>
              <select 
                required
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-foreground bg-transparent"
              >
                <option value="">Select a category</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">Description</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-foreground resize-none" 
              />
            </div>
          </div>

          <div className="bg-white border border-border p-8 flex flex-col gap-6">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] mb-2 border-b border-border pb-2">Status & Tags</h2>
            
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.inStock}
                  onChange={e => setFormData({...formData, inStock: e.target.checked})}
                  className="w-4 h-4 accent-foreground"
                />
                <span className="font-sans text-sm">In Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isFeatured}
                  onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                  className="w-4 h-4 accent-foreground"
                />
                <span className="font-sans text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isNewArrival}
                  onChange={e => setFormData({...formData, isNewArrival: e.target.checked})}
                  className="w-4 h-4 accent-foreground"
                />
                <span className="font-sans text-sm">New Arrival</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isBestSeller}
                  onChange={e => setFormData({...formData, isBestSeller: e.target.checked})}
                  className="w-4 h-4 accent-foreground"
                />
                <span className="font-sans text-sm">Best Seller (The Icon)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isLimitedEdition}
                  onChange={e => setFormData({...formData, isLimitedEdition: e.target.checked})}
                  className="w-4 h-4 accent-foreground"
                />
                <span className="font-sans text-sm">Limited Edition</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => setLocation("/admin/products")}
              className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground px-6 py-4"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createMutation.isPending}
              className="bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] px-10 py-4 luxury-button hover:bg-foreground/90 disabled:opacity-50"
            >
              {createMutation.isPending ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
