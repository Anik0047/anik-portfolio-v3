import { cn } from '@/lib/utils';

export default function BrandLogoHalfText({
  className,
}: {
  className?: string;
}) {
  return (
    // version 1

    // <svg
    //   width="500"
    //   height="129"
    //   viewBox="0 0 500 129"
    //   xmlns="http://www.w3.org/2000/svg"
    //   className={cn(className)}
    // >
    //   <path d="M0 101.9H43.1L115.4 30.6V77.1H81.7L103.5 101.9H150.6V0H103.3L0 101.9Z" />
    //   <path d="M277.5 0V59.2L206.7 0H160.4V101.9H219.6L241.2 77.1H195.6V31.2L312.7 128.5V0H277.5Z" />
    //   <path d="M322.7 101.9L358.5 128.5V0H322.7V101.9Z" />
    //   <path d="M500 0H457.3L413.3 38.1H403.8V0H368.5V101.9H403.8V63.3H458.5V101.9H493.7V38.1H457.3L500 0Z" />
    // </svg>

    // version 2
    <svg
      width="500"
      height="103"
      viewBox="0 0 500 103"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M43.2 81.5H0L103.4 0H150.6V81.5H103.5L81.8 61.7H115.3V24.5L43.2 81.6V81.5Z" />
      <path d="M195.6 24.9V61.7H241.3L219.6 81.5H160.4V0H206.8L277.5 47.4V0H312.7V102.7L195.6 24.9Z" />
      <path d="M322.7 81.5V0H358.5V102.7L322.7 81.5Z" />
      <path d="M403.7 0V30.5H413.2L457.2 0H500L457.2 30.5H493.5V81.6H458.3V50.7H403.7V81.6H368.3V0H403.7Z" />
    </svg>
  );
}
