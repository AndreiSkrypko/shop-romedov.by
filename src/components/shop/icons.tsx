type IconProps = { className?: string };

export function PhoneIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.6 2.5c.9 0 1.7.5 2 1.4l.9 2.3c.3.8.1 1.7-.5 2.3l-1 1c.8 1.7 2.2 3.1 3.9 3.9l1-1c.6-.6 1.5-.8 2.3-.5l2.3.9c.9.3 1.4 1.1 1.4 2v2.3c0 1.4-1.2 2.5-2.6 2.4-3.7-.3-7.2-1.9-9.8-4.5C4 12.4 2.4 8.9 2.1 5.2 2 3.8 3.1 2.6 4.5 2.5h2.1Z" />
    </svg>
  );
}

export function MailIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M2 6.6c0-1.3 1-2.3 2.3-2.3h15.4c1.3 0 2.3 1 2.3 2.3v.5l-10 5.6L2 7.1V6.6Zm0 2.8v8c0 1.3 1 2.3 2.3 2.3h15.4c1.3 0 2.3-1 2.3-2.3v-8l-9.5 5.3c-.3.2-.7.2-1 0L2 9.4Z" />
    </svg>
  );
}

export function TelegramIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.9 4.4 2.9 11.7c-1.1.4-1.1 1.5 0 1.8l4.6 1.4 1.7 5.4c.3.8.9 1 1.5.4l2.4-2.3 4.6 3.4c.8.6 1.7.2 1.9-.8l3-14.4c.2-1.1-.6-1.7-1.7-1.2ZM9.6 14.4l8.2-5.1c.4-.2.7.3.4.6l-6.6 6c-.2.2-.4.5-.4.8l-.2 2.1-1.4-4.4Z" />
    </svg>
  );
}

export function ViberIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.1 1.6c-2.9 0-5.2.3-6.9 1.2C3.6 3.7 2.6 5.3 2.2 7.4c-.4 2-.4 4.5 0 6.7.4 2.1 1.5 3.6 3.1 4.5.4.2.9.4 1.4.6v3.2c0 .5.6.8 1 .5l3.1-3c.4 0 .8 0 1.2-.1 1.7-.1 3.2-.4 4.4-1 1.6-.9 2.7-2.4 3.1-4.5.4-2.2.4-4.7 0-6.7-.4-2.1-1.5-3.7-3.1-4.6-1.7-.9-4-1.2-6.3-1.2Zm-2.6 4.2c.4-.1.8.1 1.1.5l1 1.5c.3.4.2 1-.2 1.3l-.4.3c-.2.2-.2.4-.1.6.4.9 1.1 1.6 2 2 .2.1.5 0 .6-.2l.3-.4c.3-.4.9-.5 1.3-.2l1.5 1c.4.3.6.7.5 1.1-.2.9-.9 1.6-1.9 1.7-.3 0-.6 0-.9-.1-2-.6-3.7-1.7-5-3.3-.9-1.1-1.5-2.3-1.7-3.6-.1-1.1.6-2 1.6-2.2h.2Zm3.6-.6c1.9.2 3.4 1.6 3.7 3.5.1.3-.2.6-.5.6-.3 0-.5-.2-.6-.5-.2-1.4-1.3-2.4-2.7-2.5-.3 0-.5-.3-.5-.6 0-.3.3-.5.6-.5Zm.2 2c.9.2 1.6.9 1.7 1.8 0 .3-.2.5-.5.6-.3 0-.5-.2-.6-.5-.1-.4-.4-.7-.8-.8-.3-.1-.5-.3-.4-.6 0-.3.3-.5.6-.5Z" />
    </svg>
  );
}
