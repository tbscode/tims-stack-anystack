import { GradientTitle } from "./gradient-title";

export const ArticleFeedHeader = () => {
  return (
    <div className="relative w-full h-64 grid items-center p-4  2xl:mb-10 2xl:mt-10">
      <GradientTitle />
      <div className="stats shadow w-fit justify-center justify-self-center fixed mt-32 z-2 bg-none">
        <div className="stat w-fit">
          <div className="stat-title">Total Page Views</div>
          <div className="stat-value">89,400</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>
    </div>
  );
};