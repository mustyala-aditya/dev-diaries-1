import { FileText, Code, Link as LinkIcon, File } from 'lucide-react';

export const CARD_TYPES = {
  note: 'note',
  code: 'code',
  link: 'link',
  file: 'file'
} as const;

export const CARD_TYPE_ICONS = {
  [CARD_TYPES.note]: FileText,
  [CARD_TYPES.code]: Code,
  [CARD_TYPES.link]: LinkIcon,
  [CARD_TYPES.file]: File
};

export const CARD_TYPE_COLORS = {
  [CARD_TYPES.note]: 'bg-blue-50 text-blue-600 border-blue-200',
  [CARD_TYPES.code]: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  [CARD_TYPES.link]: 'bg-purple-50 text-purple-600 border-purple-200',
  [CARD_TYPES.file]: 'bg-orange-50 text-orange-600 border-orange-200'
};