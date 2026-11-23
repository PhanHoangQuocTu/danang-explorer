import { MainLayout } from '@/components/layouts';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import type { Locale } from '@/i18n/routing';

import { loadTravelDataset } from '../Travel/loadTravelDataset';
import { hasCompleteEditorial } from './editorial';
import { TripIdeasView } from './TripIdeasView';

export const TripIdeas = async ({ locale }: { locale: Locale }) => {
  const [{ t }, result] = await Promise.all([useTranslationsServer('travel', locale), loadTravelDataset()]);
  const editorial = result.ok && hasCompleteEditorial(result.dataset.editorial) ? result.dataset.editorial : null;
  return (
    <MainLayout>
      <TripIdeasView t={t} editorial={editorial} />
    </MainLayout>
  );
};
