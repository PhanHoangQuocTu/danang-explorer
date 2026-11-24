import type { ITravelDataset } from '@/lib/travel-data/type';

import { TravelState } from '../Travel/TravelState';
import { SectionBreadcrumb } from '../Travel/SectionBreadcrumb';
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
        <nav aria-label={t('tripIdeas.title')} className='flex flex-wrap gap-x-6 border-b'>
          {editorialSections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className='inline-flex min-h-11 items-center text-sm font-medium text-primary underline decoration-primary/40 underline-offset-4'
            >
              {t(`tripIdeas.${section}`)}
            </a>
          ))}
        </nav>
        {editorialSections.map((section) => (
          <section
            key={section}
            aria-labelledby={section}
            className='grid gap-4 md:grid-cols-[minmax(10rem,1fr)_minmax(0,2fr)] md:gap-12'
          >
            <h2
              id={section}
              className='self-start font-serif text-3xl tracking-tight text-ocean sm:text-4xl md:sticky md:top-24'
            >
              {t(`tripIdeas.${section}`)}
            </h2>
            <div className='min-w-0 divide-y border-t border-ocean/30'>
              {editorial[section].map(({ title, content }, index) => (
                <article key={`${index}-${title}`} lang='vi' className='space-y-3 py-7'>
                  <h3 className='text-xl leading-snug font-medium wrap-anywhere whitespace-pre-wrap'>{title}</h3>
                  <p className='max-w-[68ch] leading-7 wrap-anywhere whitespace-pre-wrap'>{content}</p>
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
