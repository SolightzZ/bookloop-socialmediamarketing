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
  | 'user_login'
  | 'user_register'
  | 'user_logout';

export interface EventPayload {
  [key: string]: any;
}

export const trackEvent = (eventName: AnalyticsEvent, payload?: EventPayload): void => {
  if (process.env.NODE_ENV !== 'production') {
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
};
