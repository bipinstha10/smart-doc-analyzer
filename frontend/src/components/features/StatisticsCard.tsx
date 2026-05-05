type Stat = { label: string; percentage: number };

const StatisticsCard = ({ statistics }: { statistics: Stat[] }) => {
  return (
    <div className="w-full rounded-xl bg-[#E8E8E8] p-5">
      <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
        Live Statistics
      </p>

      <div className="mt-4 space-y-3">
        {statistics.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-sm text-[#474747]">{stat.label}</span>

            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-outlineVariant/20">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>

              <span className="text-xs font-semibold text-onBackground w-8 text-right">
                {stat.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsCard;
