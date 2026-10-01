import { Order, OrderStatus, PaymentStatus, TrackingMilestone } from '../types/order';
import { authService } from './authService';
import { apiClient } from './apiClient';
import { logWarn } from '../utils/logger';

const ORDERS_STORAGE_KEY = 'bookloop_all_orders';

class OrderService {
  private getStoredOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      logWarn('getStoredOrders: corrupt orders in localStorage, returning []', e);
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

  // สร้างออเดอร์บน server ก่อน (ได้ id จริง + ข้ามเครื่องได้) — server ล่มค่อย fallback local
  public async createOrder(params: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      const result = await apiClient.post<{ success: boolean; order: Order }>('orders_create.php', {
        items: params.items,
        subtotal: params.subtotal,
        shippingFee: params.shippingFee,
        discount: params.discount ?? 0,
        total: params.total,
        shippingAddress: params.shippingAddress,
        shippingMethod: params.shippingMethod,
        paymentMethod: params.paymentMethod,
        paymentStatus: params.paymentStatus,
        status: params.status,
        shippingCarrier: params.shippingCarrier,
        trackingNumber: params.trackingNumber,
      });
      if (result.success && result.order) {
        this.saveOrderLocal(result.order);
        return result.order;
      }
    } catch (e) {
      console.warn('orders_create.php unavailable, falling back to local order', e);
    }
    return this.createOrderLocal(params);
  }

  // ดึงออเดอร์ของ user จาก server แล้ว merge ลง local mirror (ข้ามเครื่องได้)
  public async refreshUserOrders(userId: string): Promise<Order[]> {
    try {
      const result = await apiClient.get<{ success: boolean; orders: Order[] }>('orders_list.php?limit=100');
      if (result.success && Array.isArray(result.orders)) {
        const mine = result.orders.filter((o) => o.userId === userId);
        const local = this.getStoredOrders();
        const seen = new Set(mine.map((o) => o.id));
        const merged = [...mine, ...local.filter((o) => !seen.has(o.id) && o.userId === userId)];
        const others = local.filter((o) => o.userId !== userId);
        this.saveStoredOrders([...merged, ...others]);
        // sync เข้าโปรไฟล์ด้วย (หน้า Account อ่านจาก userData)
        const userOrders = merged.map((o) => this.toUserOrder(o));
        try {
          authService.saveUserData(userId, { orders: userOrders });
        } catch (e) {
          // ignore storage errors — แต่ต้องเห็นใน console
          logWarn('refreshUserOrders: saveUserData failed', e);
        }
        return merged;
      }
    } catch (e) {
      console.warn('orders_list.php unavailable, using local orders', e);
    }
    return this.getUserOrders(userId);
  }

  private saveOrderLocal(order: Order): void {
    const orders = this.getStoredOrders();
    if (!orders.some((o) => o.id === order.id)) {
      orders.unshift(order);
      this.saveStoredOrders(orders);
    }
    if (order.userId && order.userId !== 'guest') {
      try {
        authService.addOrder(order.userId, this.toUserOrder(order));
      } catch (err) {
        console.error('Error syncing order with authService', err);
      }
    }
  }

  private toUserOrder(order: Order) {
    return {
      id: order.id,
      date: order.createdAt.split('T')[0],
      status: order.status === 'pending_payment' ? 'pending' : (order.status as any),
      items: order.items.map((it) => ({
        bookId: it.bookId,
        title: it.title,
        author: it.author || '',
        cover: it.image,
        price: it.price,
        originalPrice: it.originalPrice,
        quantity: it.quantity,
        condition: it.condition,
      })),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      shippingCarrier: order.shippingCarrier,
      trackingNumber: order.trackingNumber,
      shippingAddress: `${order.shippingAddress.name} ${order.shippingAddress.phone}, ${order.shippingAddress.address} ${order.shippingAddress.province} ${order.shippingAddress.postalCode}`,
      paymentMethod: order.paymentMethod.toUpperCase(),
    };
  }

  private createOrderLocal(params: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
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

    this.saveOrderLocal(newOrder);
    return newOrder;
  }

  public getOrderById(orderId: string, userId?: string): Order | null {
    const normalized = orderId.replace(/^#/, '');
    const orders = this.getStoredOrders();
    const found = orders.find(
      (o) => o.id.replace(/^#/, '') === normalized || o.id === orderId
    );
    if (found) {
      // Owner check: ออเดอร์ที่ระบุเจ้าของชัดเจน อ่านได้เฉพาะเจ้าของเท่านั้น
      // (กันผู้ใช้คนอื่นเดา BL-id แล้วเปิดดู PII)
      const viewerId = userId ?? authService.getCurrentUser()?.id;
      if (found.userId && found.userId !== 'guest') {
        if (!viewerId || found.userId !== viewerId) return null;
      }
      return found;
    }

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
