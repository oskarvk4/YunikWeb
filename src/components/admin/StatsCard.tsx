interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark/60 font-medium">{title}</p>
          <p className="text-2xl font-serif mt-1">{value}</p>
          {subtitle && <p className="text-sm text-dark/60 mt-1">{subtitle}</p>}
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% fra sidste måned
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
          {icon}
        </div>
      </div>
    </div>
  );
}
