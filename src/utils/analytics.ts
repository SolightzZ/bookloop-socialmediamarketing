// Analytics Abstraction for BookLoop (Demo prototype)
import { logWarn } from './logger';
import { apiClient } from '../services/apiClient';
export type AnalyticsEvent =
   | 'view_home'
   | 'search_book'
   | 'view_category'
   | 'view_product'
   | 'favorite_book'
   | 'add_to_cart'
   | 'begin_checkout'
   | 'purchase'
   | 'purchase_demo'
   | 'share_product'
   | 'sell_book_click'
   | 'pass_on_book_click'
   | 'pass_on_book_click_demo'
   | 'buy_second_hand_click'
   | 'sell_book_submit_demo'
   | 'campaign_view'
   | 'campaign_click'
   | 'social_share'
   | 'view_tech_stack'
   | 'review_submit_demo'
   | 'ugc_like'
   | 'ugc_share'
   | 'random_book_click'
   | 'random_book_result'
   | 'user_login'
   | 'user_register'
   | 'user_logout'
   | 'onboarding_complete'
   | 'onboarding_skip';

export interface EventPayload {
   [key: string]: any;
}

export const trackEvent = (eventName: AnalyticsEvent, payload?: EventPayload): void => {
   // Store recent events in session for audit/demo inspection if needed
   try {
      const raw = sessionStorage.getItem('bookloop_events') || '[]';
      const events = JSON.parse(raw);
      events.push({
         event: eventName,
         payload,
         timestamp: new Date().toISOString(),
      });
      if (events.length > 50) events.shift();
      sessionStorage.setItem('bookloop_events', JSON.stringify(events));
   } catch (e) {
      // private browsing / storage เต็ม — ไม่พัง flow แต่ต้องเห็นใน console
      logWarn('trackEvent: sessionStorage write failed', e);
   }

   // POST to backend track.php for purchase events (triggers order confirmation email)
   // ผ่าน apiClient เพื่อให้ส่ง token (query/body) + credentials:include + แปลง network error เป็น ApiError ภาษาไทยอัตโนมัติ
   if (eventName === 'purchase' && payload) {
      void apiClient
         .post('track.php', {
            event: 'purchase',
            email: payload.email || '',
            user_id: payload.userId || '',
            user_name: payload.userName || 'ลูกค้า',
            order_id: payload.orderId || '',
            book_title: payload.bookTitle || '',
            book_price: payload.bookPrice || '',
            metadata: {
               total: payload.total,
               itemsCount: payload.itemsCount,
               paymentMethod: payload.paymentMethod,
               items: payload.items,
               shippingAddress: payload.shippingAddress,
               shippingMethod: payload.shippingMethod,
            },
         })
         .catch((e) => {
            // non-blocking — email failure should not break checkout — แต่ต้องเห็นใน console
            // (track พัง = อีเมลยืนยันคำสั่งซื้ออาจไม่ถูกส่ง)
            logWarn('trackEvent(purchase): backend track.php unreachable, confirmation email may not send', e);
         });
   }
};
