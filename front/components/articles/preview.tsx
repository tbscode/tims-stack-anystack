const dynamicCardBaseStyles = `flex flex-col transition-all w-full h-64 sm:h-64 lg:w-120 lg:h-72 bg-base-300 rounded-xl justify-center justify-self-center content-center shadow-xl border-natural-content border-solid border`;
const cardGradientStyle = `tansition-all bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-blue-800 hover:via-indigo-500 hover:to-purple-500 hover:text-base-200`;
import { ArticleHeader } from "./preview-header";
import { ArticleTagBar } from "./preview-tag-bar";
import { ArticleContent } from "./preview-content";
import { ArticleFooter } from "./preview-footer";

const getArticleBaseStyles = ({
  hoverId,
  articleId,
  articleTags,
  hoverTag,
}) => {
  let style = ``;
  if (hoverId === articleId) {
    style = `${dynamicCardBaseStyles} scale-105 border-primary border-solid border-2`;
  } else if (hoverId !== articleId && hoverId !== null) {
    style = `${dynamicCardBaseStyles} scale-95`;
  } else {
    style = dynamicCardBaseStyles;
  }

  if (hoverTag !== null && !articleTags.includes(hoverTag)) {
    style = `${style} blur-sm`;
  } else if (hoverTag !== null && articleTags.includes(hoverTag)) {
    style = `${style} border-success border-solid border-2`;
  }
  return style;
};

export const LoadMoreCard = () => {
  return (
    <div className={`${dynamicCardBaseStyles} border-none hover:scale-95`}>
      <div
        className={`flex flex-col w-full text-base-content font-extrabold h-full rounded-xl text-center items-center content-center justify-center ${cardGradientStyle}`}
      >
        <h1 className="mb-0 text-xl sm:text-3xl xl:text-5xl">Load more?</h1>
        <h4 className="mt-0">subtitle</h4>
      </div>
    </div>
  );
};

export const ArticlePreview = ({ article, articleController }) => {
  const onMouseEnter = () => {
    if (articleController.hoverController.hoverId !== article.uuid) {
      articleController.hoverController.setHoverId(article.uuid);
    }
  };

  const onMouseLeave = () => {
    if (articleController.hoverController.hoverId === article.uuid) {
      articleController.hoverController.setHoverId(null);
    }
  };

  const baseSyles = getArticleBaseStyles({
    hoverId: articleController.hoverController.hoverId,
    articleId: article.uuid,
    hoverTag: articleController.hoverController.hoverTag,
    articleTags: article.tags,
  });

  return (
    <div
      className={baseSyles}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ArticleHeader article={article} articleController={articleController} />
      <ArticleTagBar article={article} articleController={articleController} />
      <ArticleContent article={article} articleController={articleController} />
      <ArticleFooter article={article} articleController={articleController} />
    </div>
  );
};