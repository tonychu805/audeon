import React from 'react';

interface SummaryOfDayCardProps {
  canPlay: boolean;
  onPlayDailyBrief: () => void;
  isPlaying: boolean;
  userName: string;
}

const formatDateLabel = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(date);

const getGreeting = (date: Date, name?: string) => {
  const hour = date.getHours();
  const base = (() => {
    if (hour < 5) return 'Good Early Morning';
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  })();

  if (!name) {
    return base;
  }

  return `${base} ${name}`;
};

const PlayIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M3 2l10 6-10 6V2z" />
  </svg>
);

const EqualizerIcon = () => (
  <div className="flex items-end gap-1">
    <span className="h-4 w-1 rounded bg-white animate-pulse" />
    <span className="h-3 w-1 rounded bg-white animate-pulse [animation-delay:0.2s]" />
    <span className="h-5 w-1 rounded bg-white animate-pulse [animation-delay:0.4s]" />
  </div>
);

export const SummaryOfDayCard: React.FC<SummaryOfDayCardProps> = ({
  canPlay,
  onPlayDailyBrief,
  isPlaying,
  userName
}) => {
  const today = React.useMemo(() => new Date(), []);
  const greeting = React.useMemo(() => getGreeting(today, userName || undefined), [today, userName]);
  const dateLabel = React.useMemo(() => formatDateLabel(today), [today]);

  const canPlayDailyBrief = canPlay;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white text-gray-900 shadow-lg border border-gray-200">
      <div className="relative flex flex-col items-center gap-6 p-6 sm:p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          {dateLabel}
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          {greeting}
        </h1>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onPlayDailyBrief}
            disabled={!canPlayDailyBrief}
            className={`flex items-center gap-3 rounded-full px-6 py-3 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              canPlayDailyBrief
                ? 'bg-gray-900 text-white shadow-lg hover:bg-gray-800 focus-visible:outline-gray-900'
                : 'cursor-not-allowed bg-gray-200 text-gray-500'
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-inner">
              {isPlaying ? <EqualizerIcon /> : <PlayIcon />}
            </span>
            {isPlaying ? 'Now Playing' : 'Play Daily Brief'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SummaryOfDayCard;
