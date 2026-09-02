export interface NavItem {
   label: string;
   path: string;
}

export const NAV_ITEMS: NavItem[] = [
   { label: 'หน้าแรก', path: '/' },
   { label: 'ค้นหาหนังสือ', path: '/books' },
   { label: 'ส่งต่อหนังสือ', path: '/sell' },
];

