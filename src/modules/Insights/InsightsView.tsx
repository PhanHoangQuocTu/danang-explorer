import { ListingNameLink } from '../Travel/ListingLinks';
import { ListingStatusBadge } from '../Travel/ListingStatusBadge';
import { SectionBreadcrumb } from '../Travel/SectionBreadcrumb';
import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';
import { InsightsChart } from './InsightsChart';
import type { InsightsMetrics } from './metrics';

interface InsightsViewProps extends TravelViewProps {
  metrics: InsightsMetrics | null;
}

export const InsightsView = ({ t, locale, metrics }: InsightsViewProps) => {
  const number = new Intl.NumberFormat(locale);
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 });
  const overview = metrics?.overview;
  const distributions = metrics
    ? ([
        {
          key: 'category',
          rows: metrics.categories.map(({ id, count }) => ({ id, label: t(`categories.${id}`), count })),
        },
        {
          key: 'area',
          rows: metrics.areas.map(({ id, name, count }) => ({
            id,
            label: name ?? t('insights.unknownArea'),
            count,
          })),
        },
        {
          key: 'status',
          rows: metrics.statuses.map(({ id, count }) => ({ id, label: t(`statuses.${id}`), count })),
        },
        {
          key: 'rating',
          rows: metrics.ratings.map(({ id, count }) => ({ id, label: t(`insights.buckets.${id}`), count })),
        },
      ] as const)
    : [];
  const countLabel = t('insights.count');

  return (
    <div className='min-w-0 space-y-10 pb-6 sm:space-y-12'>
      <SectionBreadcrumb t={t} title={t('insights.title')} />
      <header className='guide-intro'>
        <h1 className='guide-heading'>{t('insights.title')}</h1>
        <p className='max-w-prose leading-relaxed text-muted-foreground'>{t('insights.description')}</p>
      </header>

      {metrics && overview ? (
        <>
          <dl className='grid grid-cols-2 gap-x-6 gap-y-6 rounded-xl bg-secondary p-5 sm:grid-cols-4 sm:p-8'>
            {(
              [
                ['total', number.format(overview.total)],
                ['active', number.format(overview.active)],
                ['areas', number.format(overview.areasRepresented)],
                [
                  'coverage',
                  overview.coverage === null ? t('insights.unavailable') : percent.format(overview.coverage / 100),
                ],
              ] as const
            ).map(([key, value]) => (
              <div key={key} className='min-w-0 space-y-1'>
                <dt className='text-sm text-muted-foreground'>{t(`insights.overview.${key}`)}</dt>
                <dd className='font-serif text-3xl tracking-tight tabular-nums sm:text-4xl'>{value}</dd>
                {key === 'coverage' && (
                  <dd className='text-xs text-muted-foreground'>
                    {t('insights.coverageDetail', { rated: overview.rated, total: overview.total })}
                  </dd>
                )}
              </div>
            ))}
          </dl>
          {overview.total === 0 && <TravelState t={t} state='empty' />}

          <div className='grid gap-x-12 gap-y-12 lg:grid-cols-2'>
            {distributions.map(({ key, rows }) => {
              const titleId = `insights-${key}-title`;
              const descriptionId = `insights-${key}-description`;
              return (
                <section
                  key={key}
                  aria-labelledby={titleId}
                  aria-describedby={descriptionId}
                  className='min-w-0 space-y-4 border-t border-ocean/50 pt-5'
                >
                  <h2 id={titleId} className='font-serif text-3xl tracking-tight text-ocean'>
                    {t(`insights.distributions.${key}.title`)}
                  </h2>
                  <p id={descriptionId} className='text-sm text-muted-foreground'>
                    {t(`insights.distributions.${key}.description`)}
                  </p>
                  {key === 'rating' && (
                    <p className='text-sm text-muted-foreground'>
                      <span>
                        {overview.rated === 0
                          ? t('insights.ratingEmpty')
                          : t('insights.ratedOnly', { count: overview.rated })}
                      </span>{' '}
                      <span>{t('insights.noRating', { count: overview.noRating })}</span>
                    </p>
                  )}
                  {rows.some(({ count }) => count > 0) && (
                    <InsightsChart
                      rows={rows}
                      layout={key === 'rating' ? 'horizontal' : 'vertical'}
                      countLabel={countLabel}
                      locale={locale}
                    />
                  )}
                  <table aria-labelledby={titleId} className='w-full table-fixed border-t text-sm'>
                    <thead>
                      <tr className='text-muted-foreground'>
                        <th scope='col' className='py-2 text-start font-medium'>
                          {t('insights.label')}
                        </th>
                        <th scope='col' className='w-24 py-2 text-end font-medium'>
                          {countLabel}
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y'>
                      {rows.map(({ id, label, count }) => (
                        <tr key={id}>
                          <th
                            scope='row'
                            lang={key === 'area' && id !== 'unknown' ? 'vi' : undefined}
                            className='py-2 pe-2 text-start font-medium wrap-anywhere'
                          >
                            {label}
                          </th>
                          <td className='text-end tabular-nums'>{number.format(count)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              );
            })}
          </div>

          <section aria-labelledby='insights-top-title' className='space-y-3'>
            <h2 id='insights-top-title' className='font-serif text-3xl tracking-tight'>
              {t('insights.top.title')}
            </h2>
            <p className='max-w-prose text-sm text-muted-foreground'>{t('insights.top.description')}</p>
            {metrics.topRated.length === 0 ? (
              <p className='text-sm text-muted-foreground'>{t('insights.top.empty')}</p>
            ) : (
              <ul className='divide-y border-y'>
                {metrics.topRated.map(({ id, name, rating, mainCategory, areaName, status }) => (
                  <li key={id} className='flex flex-wrap items-start justify-between gap-2 py-3'>
                    <div className='min-w-0 space-y-1'>
                      <h3 className='font-medium'>
                        <ListingNameLink id={id} name={name} />
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        {t(`categories.${mainCategory}`)}
                        {areaName && (
                          <>
                            {' · '}
                            <span lang='vi'>{areaName}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2 text-sm tabular-nums'>
                      <span>{t('insights.ratingValue', { value: rating })}</span>
                      <ListingStatusBadge t={t} status={status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <TravelState t={t} state='error' />
      )}

      <section aria-labelledby='insights-method-title' className='space-y-2 border-t pt-5'>
        <h2 id='insights-method-title' className='font-medium'>
          {t('insights.method.title')}
        </h2>
        <p className='max-w-prose text-sm leading-relaxed text-muted-foreground'>{t('insights.method.description')}</p>
      </section>
    </div>
  );
};
