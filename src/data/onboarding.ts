import type { ElementType } from 'react';
import {
  AutoStories as NovelIcon,
  SelfImprovement as GrowthIcon,
  BusinessCenter as BusinessIcon,
  Science as KnowledgeIcon,
  Palette as ComicIcon,
  School as EducationIcon,
  ChildCare as KidsIcon,
  AutoAwesome as RareIcon,
  Biotech as ScienceIcon,
  History as HistoryIcon,
  Computer as TechnologyIcon,
  Psychology as PsychologyIcon,
  AccountBalance as FinanceIcon,
  HealthAndSafety as HealthIcon,
  Brush as ArtIcon,
  Translate as LanguageIcon,
} from '@mui/icons-material';

export interface OnboardingCategory {
  id: string;
  name: string;
  desc: string;
  Icon: ElementType;
  /** true = 8 หมวดหลักของ BookLoop, false = หมวดเสริม (เพิ่มได้โดยไม่ต้อง redesign UI) */
  core: boolean;
}

export const MIN_ONBOARDING_CATEGORIES = 3;
export const MAX_ONBOARDING_CATEGORIES = 8;
export const PREVIEW_BOOK_COUNT = 6;

export const onboardingCategories: OnboardingCategory[] = [
  { id: 'novel', name: 'นิยาย', desc: 'วรรณกรรม นิยายแปล โรแมนติก สืบสวน แฟนตาซี', Icon: NovelIcon, core: true },
  { id: 'growth', name: 'พัฒนาตนเอง', desc: 'จิตวิทยา การใช้ชีวิต การทำงาน นิสัย', Icon: GrowthIcon, core: true },
  { id: 'business', name: 'ธุรกิจ', desc: 'การลงทุน การเงิน การตลาด สตาร์ทอัพ', Icon: BusinessIcon, core: true },
  { id: 'knowledge', name: 'ความรู้', desc: 'วิทยาศาสตร์ ประวัติศาสตร์ สังคม ปรัชญา', Icon: KnowledgeIcon, core: true },
  { id: 'comic', name: 'การ์ตูน', desc: 'มังงะ คอมมิคส์ หนังสือภาพ', Icon: ComicIcon, core: true },
  { id: 'education', name: 'การศึกษา', desc: 'ตำราเรียน ภาษา คู่มือสอบ', Icon: EducationIcon, core: true },
  { id: 'kids', name: 'เด็ก', desc: 'นิทาน หนังสือเด็ก เสริมจินตนาการ', Icon: KidsIcon, core: true },
  { id: 'rare', name: 'หนังสือสะสม', desc: 'ฉบับพิมพ์ครั้งแรก หนังสือหายาก ปกแข็ง', Icon: RareIcon, core: true },
  // หมวดเสริม — เพิ่ม/ลดได้โดยไม่ต้อง redesign
  { id: 'science', name: 'วิทยาศาสตร์', desc: 'ฟิสิกส์ ชีววิทยา ดาราศาสตร์', Icon: ScienceIcon, core: false },
  { id: 'history', name: 'ประวัติศาสตร์', desc: 'ประวัติศาสตร์ไทยและโลก', Icon: HistoryIcon, core: false },
  { id: 'technology', name: 'เทคโนโลยี', desc: 'คอมพิวเตอร์ AI นวัตกรรม', Icon: TechnologyIcon, core: false },
  { id: 'psychology', name: 'จิตวิทยา', desc: 'จิตวิทยา พฤติกรรม ความสัมพันธ์', Icon: PsychologyIcon, core: false },
  { id: 'finance', name: 'การเงิน', desc: 'การออม หุ้น วางแผนการเงิน', Icon: FinanceIcon, core: false },
  { id: 'health', name: 'สุขภาพ', desc: 'ออกกำลังกาย โภชนาการ สุขภาพใจ', Icon: HealthIcon, core: false },
  { id: 'art', name: 'ศิลปะ', desc: 'ศิลปะ ดีไซน์ ภาพถ่าย ดนตรี', Icon: ArtIcon, core: false },
  { id: 'language', name: 'ภาษา', desc: 'อังกฤษ ญี่ปุ่น จีน และภาษาอื่นๆ', Icon: LanguageIcon, core: false },
];

export const onboardingCategoryNameById: Record<string, string> = Object.fromEntries(
  onboardingCategories.map((c) => [c.id, c.name]),
);

export function getCategoryThaiName(id: string): string {
  return onboardingCategoryNameById[id] ?? id;
}
