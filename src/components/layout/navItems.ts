export interface NavItem {
   label: string;
   path: string;
}

export const NAV_ITEMS: NavItem[] = [
   { label: 'หน้าแรก', path: '/' },
   { label: 'ค้นหาหนังสือ', path: '/books' },
   { label: 'ขายหนังสือ', path: '/sell' },
   { label: 'แคมเปญ', path: '/campaign/read-share-repeat' },
   { label: 'เรื่องราวของเรา', path: '/about' },
   { label: 'เทคโนโลยี', path: '/techstack' },
];
