interface RatingBadgeProps {
  ratingValue: number;
  reviewCount: number;
  className?: string;
}

export default function RatingBadge({ ratingValue, reviewCount, className }: RatingBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 text-white text-sm ${className || ''}`}>
      <span aria-hidden>★</span>
      <span className="font-semibold">{ratingValue.toFixed(1)}</span>
      <span className="opacity-80">({reviewCount} recenzií)</span>
    </div>
  );
}


