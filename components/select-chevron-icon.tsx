type SelectChevronIconProps = {
  className?: string;
};

export default function SelectChevronIcon({ className = "h-4 w-4" }: SelectChevronIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

