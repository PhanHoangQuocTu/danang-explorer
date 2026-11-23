import type { ITravelDataset } from '@/lib/travel-data/type';

import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';
import { editorialSections } from './editorial';

type TripIdeasViewProps = Pick<TravelViewProps, 't'> & { editorial: ITravelDataset['editorial'] | null };

export const TripIdeasView = ({ t, editorial }: TripIdeasViewProps) => (
  <div className='min-w-0 space-y-10 pb-6 sm:space-y-14'>
    <header className='border-b pt-3 pb-6 sm:pt-5'>
      <h1 className='font-[family-name:Times_New_Roman,Times,serif] text-4xl tracking-tight sm:text-5xl'>
        {t('tripIdeas.title')}
      </h1>
      <p className='mt-3 max-w-xl text-muted-foreground'>{t('tripIdeas.description')}</p>
    </header>
    {editorial ? (
      <div className='space-y-10 sm:space-y-14'>
        {editorialSections.map((section) => (
          <section
            key={section}
            aria-labelledby={section}
            className='grid gap-4 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10'
          >
            <h2
              id={section}
              className='font-[family-name:Times_New_Roman,Times,serif] text-2xl tracking-tight sm:text-3xl'
            >
              {t(`tripIdeas.${section}`)}
            </h2>
            <div className='min-w-0 divide-y border-y'>
              {editorial[section].map(({ title, content }, index) => (
                <article key={`${index}-${title}`} lang='vi' className='space-y-2 py-5 first:pt-4 last:pb-4'>
                  <h3 className='wrap-anywhere whitespace-pre-wrap font-semibold text-lg leading-snug'>{title}</h3>
                  <p className='wrap-anywhere max-w-prose whitespace-pre-wrap text-muted-foreground leading-relaxed'>
                    {content}
                  </p>
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
