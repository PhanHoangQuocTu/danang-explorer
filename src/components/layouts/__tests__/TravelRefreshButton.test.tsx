import { act, fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { messages } from '@/messages';

import { TravelRefreshButton } from '../TravelRefreshButton';

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock('@/i18n/navigation', () => ({ useRouter: () => ({ refresh }) }));

const storageKey = 'travel:refresh-until';
const mount = (locale: 'en' | 'vi' = 'en') =>
  render(
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <TravelRefreshButton />
    </NextIntlClientProvider>
  );

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  refresh.mockReset();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('TravelRefreshButton', () => {
  it('blocks rapid attempts, survives remount, and expires after 60 seconds', () => {
    const view = mount();
    const button = screen.getByRole('button', { name: 'Refresh data' });
    act(() => {
      button.click();
      button.click();
    });
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(messages.en.travel.refresh.cooldown);
    view.unmount();

    mount();
    expect(screen.getByRole('button')).toBeDisabled();
    act(() => vi.advanceTimersByTime(60_000));
    fireEvent.click(screen.getByRole('button'));
    expect(refresh).toHaveBeenCalledTimes(2);
  });

  it.each(['Infinity', 'bad', '99999999999999', '1'])('ignores invalid or expired storage value %s', (value) => {
    localStorage.setItem(storageKey, value);
    mount();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('handles denied storage and keeps the current URL and history', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });
    const initialUrl = location.href;
    const historyLength = history.length;
    mount('vi');
    const button = screen.getByRole('button', { name: messages.vi.travel.refresh.label });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(refresh).toHaveBeenCalledOnce();
    expect(location.href).toBe(initialUrl);
    expect(history.length).toBe(historyLength);
  });

  it('reads a valid cooldown written by another tab and releases it on expiry', () => {
    mount();
    const deadline = String(Date.now() + 1000);
    act(() => {
      localStorage.setItem(storageKey, deadline);
      window.dispatchEvent(
        new StorageEvent('storage', { key: storageKey, newValue: deadline, storageArea: localStorage })
      );
    });
    expect(screen.getByRole('button')).toBeDisabled();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('button')).toBeEnabled();
    expect(refresh).not.toHaveBeenCalled();
  });
});
