import type { Locale } from '@/i18n/routing';
import type { Translator } from '@/types/translation';

export interface TravelViewProps {
  t: Translator<'travel'>;
  locale: Locale;
}
