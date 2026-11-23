import { Badge } from '@/components/ui/badge';
import type { ListingStatus } from '@/lib/travel-data/type';

import type { TravelViewProps } from './type';

const statusVariants = {
  ACTIVE: 'secondary',
  UNVERIFIED: 'outline',
  WARNING: 'secondary',
  CLOSED_BANNED: 'destructive',
  UNKNOWN: 'outline',
} as const satisfies Record<ListingStatus, 'secondary' | 'outline' | 'destructive'>;

export const ListingStatusBadge = ({ status, t }: Pick<TravelViewProps, 't'> & { status: ListingStatus }) => (
  <Badge variant={statusVariants[status]} className='h-auto whitespace-normal'>
    {t(`statuses.${status}`)}
  </Badge>
);
