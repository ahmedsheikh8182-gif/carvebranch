import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetDashboardStats } from "@workspace/api-client-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats({ query: { retry: false, throwOnError: false } });

  if (isLoading || !stats) {
    return (
      <AdminLayout>
        <div className="animate-pulse flex flex-col gap-8">
          <div className="h-10 w-64 bg-secondary" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-secondary" />)}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-12">
        <h1 className="font-serif text-4xl">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-border p-6 flex flex-col gap-2 bg-secondary/20">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Total Revenue</span>
            <span className="font-serif text-3xl">${stats.totalRevenue.toLocaleString()}</span>
          </div>
          <div className="border border-border p-6 flex flex-col gap-2 bg-secondary/20">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Orders</span>
            <span className="font-serif text-3xl">{stats.totalOrders}</span>
          </div>
          <div className="border border-border p-6 flex flex-col gap-2 bg-secondary/20">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Customers</span>
            <span className="font-serif text-3xl">{stats.totalCustomers}</span>
          </div>
          <div className="border border-border p-6 flex flex-col gap-2 bg-secondary/20">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Products</span>
            <span className="font-serif text-3xl">{stats.totalProducts}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Recent Orders */}
          <div>
            <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] mb-6 border-b border-border pb-2">Recent Orders</h2>
            <div className="flex flex-col gap-4">
              {stats.recentOrders?.map(order => (
                <div key={order.id} className="flex justify-between items-center p-4 border border-border bg-white text-sm">
                  <div>
                    <span className="font-medium block mb-1">#{order.orderNumber}</span>
                    <span className="text-muted-foreground text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="block mb-1">${order.total.toFixed(2)}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{order.status}</span>
                  </div>
                </div>
              ))}
              {!stats.recentOrders?.length && <p className="text-sm text-muted-foreground">No recent orders.</p>}
            </div>
          </div>

          {/* Top Products */}
          <div>
            <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] mb-6 border-b border-border pb-2">Top Products</h2>
            <div className="flex flex-col gap-4">
              {stats.topProducts?.map(product => (
                <div key={product.id} className="flex items-center gap-4 p-4 border border-border bg-white text-sm">
                  <div className="w-12 h-16 bg-secondary shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-[#F5F3EF] to-[#E8E4DE]" />
                  </div>
                  <div>
                    <span className="font-medium block mb-1">{product.name}</span>
                    <span className="text-muted-foreground text-xs">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {!stats.topProducts?.length && <p className="text-sm text-muted-foreground">No top products.</p>}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
