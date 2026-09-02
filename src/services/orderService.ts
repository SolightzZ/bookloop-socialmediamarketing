import { Order, OrderStatus, PaymentStatus, TrackingMilestone } from '../types/order';
import { authService } from './authService';

const ORDERS_STORAGE_KEY = 'bookloop_all_orders';

class OrderService {
  private getStoredOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private saveStoredOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }

  public createOrder(params: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const rawNumber = Math.floor(100000 + Math.random() * 900000);
    const id = `BL-${rawNumber}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...params,
      id,
      trackingNumber: params.trackingNumber || `TH${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      shippingCarrier: params.shippingCarrier || 'Flash Express',
      createdAt: now,
      updatedAt: now,
    };

    const orders = this.getStoredOrders();
    orders.unshift(newOrder);
    this.saveStoredOrders(orders);

    // Sync to user profile in authService if logged in
    if (newOrder.userId && newOrder.userId !== 'guest') {
      try {
        // Convert to UserOrder format for backward compatibility
        authService.addOrder(newOrder.userId, {
          id: newOrder.id,
          date: newOrder.createdAt.split('T')[0],
          status: newOrder.status === 'pending_payment' ? 'pending' : (newOrder.status as any),
          items: newOrder.items.map((it) => ({
            bookId: it.bookId,
            title: it.title,
            author: it.author || '',
            cover: it.image,
            price: it.price,
            originalPrice: it.originalPrice,
            quantity: it.quantity,
            condition: it.condition,
          })),
          subtotal: newOrder.subtotal,
          shippingFee: newOrder.shippingFee,
          total: newOrder.total,
          shippingCarrier: newOrder.shippingCarrier,
          trackingNumber: newOrder.trackingNumber,
          shippingAddress: `${newOrder.shippingAddress.name} ${newOrder.shippingAddress.phone}, ${newOrder.shippingAddress.address} ${newOrder.shippingAddress.province} ${newOrder.shippingAddress.postalCode}`,
          paymentMethod: newOrder.paymentMethod.toUpperCase(),
        });
      } catch (err) {
        console.error('Error syncing order with authService', err);
      }
    }

    return newOrder;
  }

  public getOrderById(orderId: string): Order | null {
    const normalized = orderId.replace(/^#/, '');
    const orders = this.getStoredOrders();
    const found = orders.find(
      (o) => o.id.replace(/^#/, '') === normalized || o.id === orderId
    );
    if (found) return found;

    // Fallback search in user data
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const userData = authService.getUserData(currentUser.id);
      const userOrder = (userData.orders || []).find(
        (o) => o.id.replace(/^#/, '') === normalized || o.id === orderId
      );
      if (userOrder) {
        // convert to Order format
        const fallbackOrder: Order = {
          id: userOrder.id,
          userId: currentUser.id,
          items: userOrder.items.map((it) => ({
            bookId: it.bookId,
            title: it.title,
            image: it.cover,
            price: it.price,
            originalPrice: it.originalPrice,
            quantity: it.quantity,
            author: it.author,
            condition: it.condition,
          })),
          subtotal: userOrder.subtotal,
          shippingFee: userOrder.shippingFee || 0,
          discount: 0,
          total: userOrder.total,
          shippingAddress: {
            name: currentUser.name,
            phone: currentUser.phone || '0812345678',
            address: currentUser.address?.street || '99/1 ถ.พหลโยธิน',
            province: currentUser.address?.province || 'กรุงเทพมหานคร',
            postalCode: currentUser.address?.postalCode || '10400',
          },
          shippingMethod: 'Standard Shipping (ฟรี)',
          paymentMethod: 'promptpay',
          paymentStatus: 'paid',
          status: (userOrder.status as any) || 'processing',
          trackingNumber: userOrder.trackingNumber || `TH${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          shippingCarrier: userOrder.shippingCarrier || 'Flash Express',
          createdAt: userOrder.date ? `${userOrder.date}T09:00:00.000Z` : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return fallbackOrder;
      }
    }

    return null;
  }

  public getUserOrders(userId: string): Order[] {
    const orders = this.getStoredOrders();
    return orders.filter((o) => o.userId === userId);
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus): Order | null {
    const orders = this.getStoredOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.id.replace(/^#/, '') === orderId.replace(/^#/, ''));
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      status,
      ...(paymentStatus ? { paymentStatus } : {}),
      updatedAt: new Date().toISOString(),
    };

    this.saveStoredOrders(orders);
    return orders[index];
  }

  public getTrackingMilestones(order: Order): TrackingMilestone[] {
    const orderDate = new Date(order.createdAt);
    const formatDate = (date: Date, hoursOffset = 0, minutesOffset = 0) => {
      const d = new Date(date.getTime() + (hoursOffset * 60 + minutesOffset) * 60 * 1000);
      return d.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const carrier = order.shippingCarrier || 'Flash Express';

    // Status progression logic
    const isPendingPayment = order.status === 'pending_payment';
    const isProcessing = ['processing', 'shipped', 'out_for_delivery', 'delivered'].includes(order.status);
    const isShipped = ['shipped', 'out_for_delivery', 'delivered'].includes(order.status);
    const isOutForDelivery = ['out_for_delivery', 'delivered'].includes(order.status);
    const isDelivered = order.status === 'delivered';

    return [
      {
        step: 1,
        title: 'สร้างคำสั่งซื้อสำเร็จ',
        description: `บันทึกรายการคำสั่งซื้อเรียบร้อย รอคัดแยกหนังสือจากคลัง`,
        location: 'BookLoop Hub (กรุงเทพฯ)',
        timestamp: formatDate(orderDate, 0, 0),
        completed: !isPendingPayment,
        current: order.status === 'pending_payment' || order.status === 'paid',
      },
      {
        step: 2,
        title: 'ผู้ส่งมอบพัสดุให้ขนส่ง',
        description: `ขนส่ง ${carrier} เข้ารับพัสดุที่ศูนย์คัดแยก BookLoop เรียบร้อย`,
        location: 'ศูนย์กระจายสินค้า กทม. (บางนา)',
        timestamp: formatDate(orderDate, 2, 30),
        completed: isProcessing || isShipped || isOutForDelivery || isDelivered,
        current: order.status === 'processing',
      },
      {
        step: 3,
        title: 'พัสดุอยู่ระหว่างการขนส่ง',
        description: `พัสดุเดินทางถึงศูนย์คัดแยกปลายทาง เตรียมคัดแยกไปยังสาขานำจ่าย`,
        location: 'ศูนย์คัดแยกสินค้าหลัก (วังน้อย)',
        timestamp: formatDate(orderDate, 14, 15),
        completed: isShipped || isOutForDelivery || isDelivered,
        current: order.status === 'shipped',
      },
      {
        step: 4,
        title: 'พัสดุกำลังนำจ่าย',
        description: `พนักงานนำจ่ายกำลังเดินทางไปส่งพัสดุที่ที่อยู่ของคุณ (โทรนัดหมายก่อนส่ง)`,
        location: `สาขาปลายทาง (${order.shippingAddress?.province || 'กรุงเทพฯ'})`,
        timestamp: formatDate(orderDate, 24, 0),
        completed: isOutForDelivery || isDelivered,
        current: order.status === 'out_for_delivery',
      },
      {
        step: 5,
        title: 'จัดส่งพัสดุสำเร็จ',
        description: `ผู้รับได้รับพัสดุเรียบร้อย ขอบคุณที่ร่วมส่งต่อความรู้กับ BookLoop`,
        location: `${order.shippingAddress?.address || 'ที่อยู่จัดส่ง'}`,
        timestamp: formatDate(orderDate, 26, 45),
        completed: isDelivered,
        current: isDelivered,
      },
    ];
  }
}

export const orderService = new OrderService();
