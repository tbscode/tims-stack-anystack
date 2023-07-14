
export const ArticleHeader = ({ article, articleController }) => {
  return (
    <div className="prose w-full bg-base-200 rounded-xl p-1 pl-4 sm:pl-8">
      <h1 className="mb-0 text-xl sm:text-3xl xl:text-5xl">{article.title}</h1>
      <h4 className="mt-0">subtitle</h4>
    </div>
  );
};