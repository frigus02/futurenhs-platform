import React from "react";

interface Props {
  className?: string;
  title?: string;
  description?: string;
}

const ChevronTopIcon = ({ className, title, description }: Props) => (
  <div className={`icon-wrapper ${className || ""}`}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="chevronTopIconId chevronTopIconDesc"
    >
      {title ? <title id="chevronTopIconId">{title}</title> : ""}
      {description ? <desc id="chevronTopIconDesc">{description}</desc> : ""}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 7.5C12.9 7.5 13.1667 7.62857 13.4333 7.88571L20.1 14.3143C20.6333 14.8286 20.6333 15.6 20.1 16.1143C19.5667 16.6286 18.7667 16.6286 18.2333 16.1143L12.5 10.5857L6.76667 16.1143C6.23333 16.6286 5.43333 16.6286 4.9 16.1143C4.36667 15.6 4.36667 14.8286 4.9 14.3143L11.5667 7.88571C11.8333 7.62857 12.1 7.5 12.5 7.5V7.5Z"
        fill="#425462"
      />
    </svg>
  </div>
);

export default ChevronTopIcon;
