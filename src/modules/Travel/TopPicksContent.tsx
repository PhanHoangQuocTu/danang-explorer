const separator = '  •  ';
const textClass = 'max-w-[68ch] leading-relaxed wrap-anywhere whitespace-pre-wrap';

export const TopPicksContent = ({ content }: { content: string }) => {
  const items = content.split(separator);
  if (items.length === 1 || items.some((item) => !item.trim())) {
    return <p className={textClass}>{content}</p>;
  }

  return (
    <ul className={`${textClass} list-disc space-y-2.5 ps-5 marker:text-primary`}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>
          {/* Keep the original separator in the source text while native list markers convey it visually. */}
          {index > 0 && (
            <span aria-hidden='true' className='sr-only'>
              {separator}
            </span>
          )}
          {item}
        </li>
      ))}
    </ul>
  );
};
