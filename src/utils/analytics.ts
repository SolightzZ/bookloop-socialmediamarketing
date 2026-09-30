// Analytics Abstraction for BookLoop (Demo prototype)
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
  if (import.meta.env?.DEV) {
    console.log(`[BookLoop Analytics] 📊 ${eventName}`, payload || {});
  }
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
  } catch {
    // ignore in private browsing
  }

  // POST to backend track.php for purchase events (triggers order confirmation email)
  if (eventName === 'purchase' && payload) {
    const sessionRaw = localStorage.getItem('bookloop_auth_session_token');
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://panitijahem.xo.je/api').replace(/\/+$/, '');

    fetch(`${API_BASE_URL}/track.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      credentials: 'include',
      body: JSON.stringify({
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
      }),
    }).catch(() => {
      // non-blocking — email failure should not break checkout
    });
  }
};
