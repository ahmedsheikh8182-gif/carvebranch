import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminListOrders, useAdminUpdateOrder, OrderStatusUpdateStatus } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminOrdersList() {
  const { data: res, isLoading } = useAdminListOrders();
  const updateMutation = useAdminUpdateOrder();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const orders = res?.orders || [];

  const handleStatusChange = (orderId: number, status: OrderStatusUpdateStatus) => {
    updateMutation.mutate({ id: orderId, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Order status updated" });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-12 border-b border-border pb-6">
        <h1 className="font-serif text-4xl">Orders</h1>
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
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Order</th>
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Date</th>
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Customer</th>
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Total</th>
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Gift</th>
                <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium">#{order.orderNumber}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{order.guestEmail || order.shippingAddress?.fullName || 'Guest'}</td>
                  <td className="px-6 py-4">PKR {order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {order.isGift ? (
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] px-2 py-1 border border-[#C9A96E] text-[#C9A96E]">
                        {order.giftWrap ? "Wrapped" : "Gift"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatusUpdateStatus)}
                      disabled={updateMutation.isPending}
                      className="border border-border p-2 font-sans text-xs uppercase tracking-wider bg-transparent focus:outline-none focus:border-foreground min-w-[120px]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
