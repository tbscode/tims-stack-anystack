import { GradientTitle } from "./gradient-title";

export const ArticleFeedHeader = () => {
  return (
    <div className="relative w-full h-64 grid items-center p-4  2xl:mb-10 2xl:mt-10">
      <GradientTitle />
      <div className="stats shadow w-fit justify-center justify-self-center fixed mt-32 z-2 bg-none">
        <div className="stat w-fit text-center">
          <div className="stat-title">Unique Page Views</div>
          <div className="stat-value">69.420</div>
          <div className="stat-desc">counting only /articles/ starting DATE</div>
        </div>
      </div>
    </div>
  );
};