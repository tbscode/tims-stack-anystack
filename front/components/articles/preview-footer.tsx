
export const ArticleFooter = ({ article, articleController }) => {
  return (
    <div className="flex flex-row w-full rounded-xl p-2 h-20 sm:h-24 relative gap-2">
      <div className="w-6/12 rounded-xl bg-base-100 flex flex-row justify-center content-center">
        <div className="avatar placeholder self-center w-14 justify-center sm:w-20">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-12 sm:w-14">
            <span className="text-3xl">K</span>
          </div>
        </div>
        <div className="flex flex-col flex-grow prose p-1 justify-center">
          <h2 className="mb-0 text-xl sm:text-xl lg:text-2xl">
            {article.author.first_name}
          </h2>
          <h4 className="mt-0 text-xs lg:text-lg">
            {article.author.second_name}
          </h4>
        </div>
      </div>
      <div className="bg-base-100 w-3/12 rounded-xl flex justify-center">
        <div className="stat flex flex-col p-1 text-center justify-center items-center">
          <div className="stat-title">Likes</div>
          <div className="stat-value text-2xl sm:text-4xl">31K</div>
        </div>
      </div>
      <div className="bg-base-100 w-3/12 rounded-xl flex justify-center">
        <div className="stat flex flex-col p-1 text-center justify-center items-center">
          <div className="stat-title">Views</div>
          <div className="stat-value text-2xl sm:text-4xl">31K</div>
        </div>
      </div>
    </div>
  );
};