import { cn } from '@/utils/utils';

const ProgressBar = ({ percentage, className, textClasses, showValue = false }: any) => {
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={cn('relative w-full h-6 bg-gray-300 rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-orange-500 text-white font-bold text-center absolute left-0"
        style={{ width: `${normalizedPercentage}%` }}
      >
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className={`text-sm ${textClasses}`}>{`${normalizedPercentage}%`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
