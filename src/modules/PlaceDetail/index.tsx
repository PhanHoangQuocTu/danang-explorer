import { MainLayout } from '@/components/layouts';
import type { ITravelListing } from '@/lib/travel-data/type';

import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';
import { PlaceDetailView } from './PlaceDetailView';

export const PlaceDetail = ({ t, locale, listing }: TravelViewProps & { listing: ITravelListing | null }) => (
  <MainLayout showTravelRefresh>
    {listing ? <PlaceDetailView listing={listing} t={t} locale={locale} /> : <TravelState state='error' t={t} />}
  </MainLayout>
);
