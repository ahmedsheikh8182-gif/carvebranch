import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminListProducts, useAdminDeleteProduct } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Trash, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminProductsList() {
  const { data: res, isLoading } = useAdminListProducts();
  const deleteMutation = useAdminDeleteProduct();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const products = res?.products || [];

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Product deleted" });
          queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl">Products</h1>
        <Link 
          href="/admin/products/new"
          className="flex items-center gap-2 bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] px-6 py-3 luxury-button hover:bg-foreground/90 transition-colors"
        >
          <Plus size={14} /> New Product
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-secondary w-full" />)}
        </div>
      ) : (
        <div className="bg-white border border-border overflow-hidden">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Product</th>
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Price</th>
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Stock</th>
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-14 bg-secondary shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-[#F5F3EF] to-[#E8E4DE]" />
                    </div>
                    <div>
                      <span className="font-medium block">{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {product.inStock ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-sm text-[10px] uppercase tracking-wider">In Stock</span>
                    ) : (
                      <span className="text-red-600 bg-red-50 px-2 py-1 rounded-sm text-[10px] uppercase tracking-wider">Out of Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="text-muted-foreground hover:text-foreground">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
