
export const ArticleTagBar = ({ article, articleController }) => {
  const _onMouseEnter = ({ tag }) => {
    return () => {
      if (articleController.hoverController.hoverTag !== tag) {
        articleController.hoverController.setHoverTag(tag);
      }
    };
  };

  const _onMouseLeave = ({ tag }) => {
    return () => {
      if (articleController.hoverController.hoverTag === tag) {
        articleController.hoverController.setHoverTag(null);
      }
    };
  };
  return (
    <div className="w-full bg-base-100 rounded-xl pl-2 sm:pl-8 p-0 sm:p-1">
      {article.tags.map((tag, i) => {
        return (
          <div
            key={i}
            className={`badge badge-sm sm:badge-md xl:badge-lg m-0 ml-1 lg:ml-2 ${
              articleController.hoverController.hoverTag === tag
                ? "bg-primary text-base-200"
                : "bg-accent text-base-300"
            }`}
            onMouseEnter={_onMouseEnter({ tag })}
            onMouseLeave={_onMouseLeave({ tag })}
          >
            {tag}
          </div>
        );
      })}
    </div>
  );
};