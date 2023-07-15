interface ArticleHeaderProps {
  article: any;  
  articleHeaderClassName: string;
  articleHeaderTitleClassName: string;
  articleHeaderSubitleClassName: string;
}

export function ArticleHeader({
    article,
    articleHeaderClassName = "",
    articleHeaderTitleClassName = "",
    articleHeaderSubitleClassName = "",
}: ArticleHeaderProps) {
  return (
    <div className={`prose w-full bg-base-200 rounded-xl p-1 pl-4 sm:pl-8 ${articleHeaderClassName}`}>
      <h1 className={`mb-0 text-xl sm:text-3xl xl:text-5xl ${articleHeaderTitleClassName}`}>
        {article.title}
      </h1>
      <h4 className={`mt-0 ${articleHeaderSubitleClassName}`}>subtitle</h4>
    </div>
  );
}