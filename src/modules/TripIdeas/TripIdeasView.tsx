import type { ITravelDataset } from '@/lib/travel-data/type';
import { cn } from '@/lib/utils';

import { SectionBreadcrumb } from '../Travel/SectionBreadcrumb';
import { TopPicksContent } from '../Travel/TopPicksContent';
import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';
import { editorialSections } from './editorial';

type TripIdeasViewProps = Pick<TravelViewProps, 't'> & { editorial: ITravelDataset['editorial'] | null };

export const TripIdeasView = ({ t, editorial }: TripIdeasViewProps) => (
  <div className='min-w-0 space-y-10 pb-6 sm:space-y-14'>
    <SectionBreadcrumb t={t} title={t('tripIdeas.title')} />
    <header className='guide-intro'>
      <h1 className='guide-heading'>{t('tripIdeas.title')}</h1>
      <p className='max-w-prose leading-relaxed text-muted-foreground'>{t('tripIdeas.description')}</p>
    </header>
    {editorial ? (
      <div className='space-y-12 sm:space-y-16'>
        <nav aria-label={t('tripIdeas.title')} className='flex flex-wrap gap-2'>
          {editorialSections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className='inline-flex min-h-11 items-center rounded-lg border bg-card px-3 text-sm font-medium text-primary hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring'
            >
              {t(`tripIdeas.${section}`)}
            </a>
          ))}
        </nav>
        {editorialSections.map((section) => (
          <section
            key={section}
            aria-labelledby={section}
            className='space-y-4 border-t border-ocean/40 pt-5 sm:space-y-5 sm:pt-7'
          >
            <h2 id={section} className='scroll-mt-24 text-3xl font-semibold tracking-tight text-ocean sm:text-4xl'>
              {t(`tripIdeas.${section}`)}
            </h2>
            <div
              className={cn(
                'min-w-0',
                section === 'topPicks' ? 'grid gap-4 lg:grid-cols-2' : 'max-w-[58rem] divide-y border-y'
              )}
            >
              {editorial[section].map(({ title, content }, index) => (
                <article
                  key={`${index}-${title}`}
                  lang='vi'
                  className={cn(
                    'min-w-0',
                    section === 'topPicks'
                      ? 'space-y-3 rounded-xl border bg-card px-4 py-5 text-card-foreground sm:p-6'
                      : 'grid gap-2 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] md:gap-6'
                  )}
                >
                  <h3 className='text-lg leading-snug font-semibold wrap-anywhere whitespace-pre-wrap'>{title}</h3>
                  {section === 'topPicks' ? (
                    <TopPicksContent content={content} />
                  ) : (
                    <p className='max-w-[68ch] leading-relaxed wrap-anywhere whitespace-pre-wrap'>{content}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    ) : (
      <TravelState t={t} state='error' />
    )}
  </div>
);
