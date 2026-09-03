export interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  iconName: 'novel' | 'growth' | 'business' | 'knowledge' | 'comic' | 'education' | 'kids' | 'rare';
  isFeatured?: boolean;
  accentColor?: string;
  accentBg?: string;
}

export const featuredCategories: CategoryItem[] = [
  {
    id: 'novel',
    name: 'นิยาย',
    desc: 'วรรณกรรม นิยายแปล โรแมนติก สืบสวน และแฟนตาซียอดนิยม',
    iconName: 'novel',
    isFeatured: true,
    accentColor: '#1976D2',
    accentBg: '#EBF3FA',
  },
  {
    id: 'growth',
    name: 'พัฒนาตนเอง',
    desc: 'จิตวิทยา การใช้ชีวิต สุขภาพ การทำงาน และการสร้างนิสัย',
    iconName: 'growth',
    isFeatured: true,
    accentColor: '#2E7D5B',
    accentBg: '#E8F5E9',
  },
];

export const standardCategories: CategoryItem[] = [
  {
    id: 'business',
    name: 'ธุรกิจ',
    desc: 'การลงทุน การเงิน การตลาด สตาร์ทอัพ และการบริหาร',
    iconName: 'business',
    accentColor: '#0F766E',
    accentBg: '#E6FFFA',
  },
  {
    id: 'knowledge',
    name: 'ความรู้',
    desc: 'วิทยาศาสตร์ ประวัติศาสตร์ สังคม ปรัชญา และสารคดี',
    iconName: 'knowledge',
    accentColor: '#1976D2',
    accentBg: '#EBF3FA',
  },
  {
    id: 'comic',
    name: 'การ์ตูน',
    desc: 'มังงะ คอมมิคส์ หนังสือภาพ และการ์ตูนความรู้',
    iconName: 'comic',
    accentColor: '#B7791F',
    accentBg: '#FEF3C7',
  },
  {
    id: 'education',
    name: 'การศึกษา',
    desc: 'ตำราเรียน ภาษา คู่มือสอบ และเตรียมสอบทุกระดับ',
    iconName: 'education',
    accentColor: '#0284C7',
    accentBg: '#E0F2FE',
  },
  {
    id: 'kids',
    name: 'เด็ก',
    desc: 'นิทาน หนังสือเด็ก เสริมทักษะการเรียนรู้และจินตนาการ',
    iconName: 'kids',
    accentColor: '#C2410C',
    accentBg: '#FFEDD5',
  },
  {
    id: 'rare',
    name: 'หนังสือสะสม',
    desc: 'ฉบับพิมพ์ครั้งแรก หนังสือหายาก และปกแข็งทรงคุณค่า',
    iconName: 'rare',
    accentColor: '#6B46C1',
    accentBg: '#F3E8FF',
  },
];
