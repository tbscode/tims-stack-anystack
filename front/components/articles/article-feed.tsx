import { useState } from "react";
import { DynamicLayout } from "./dynamic-layout";
import { SideBarCollapsible } from "./collapsibles";
import { ArticleFeedMenuBar } from "./feed-menu-bar";
import { ArticleFeedHeader } from "./feed-header";
import { ArticleFeedFooter } from "./feed-footer";
import { ArticlePreview, LoadMoreCard } from "./preview";
import { ARTICLES } from "./moc";

interface HoverController {
  hoverId: string | null;
  setHoverId: CallableFunction;
  hoverTag: string | null;
  setHoverTag: CallableFunction;
}

interface FilterController {
  filters: string[];
  setFilters: CallableFunction
}

interface ArticleController {
  hoverController: HoverController;
  filterController: FilterController;
}

export function ArticleFeed() {
  const [hoveredArticle, setHoveredArticle] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);
  const [filters, setFilters] = useState([]);

  const articleController: ArticleController = {
    hoverController: {
      hoverId: hoveredArticle,
      setHoverId: setHoveredArticle,
      hoverTag: hoveredTag,
      setHoverTag: setHoveredTag,
    },
    filterController: {
      filters: filters,
      setFilters: setFilters,
    },
  };
  
  const filterArticles = (article) => {
    if (filters.length === 0) return true
    // must include all filters!
    return filters.every(filter => article.tags.includes(filter))
  }

  return (
    <DynamicLayout 
      menuContent={
        <SideBarCollapsible collapsibles={[
        {
          title: "Filters",
          content: (<ArticleFeedMenuBar articleController={articleController} inSidebar={true}/>)
        },
        {
          title: "Authors 2",
          content: (<ArticleFeedMenuBar articleController={articleController} inSidebar={true}/>)
        },
      ]} />}
      articleController={articleController}>
      <div className="relative w-full 3xl:w-400">
        <ArticleFeedHeader />
        <ArticleFeedMenuBar articleController={articleController} inSidebar={false}/>
        <div className="grid relative lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-3 gap-4 w-full z-30">
          {ARTICLES.filter(article => filterArticles(article)).map((article, i) => {
            return (
              <ArticlePreview
                key={i}
                article={article}
                articleController={articleController}
              />
            );
          })}
          <LoadMoreCard />
        </div>
        <ArticleFeedFooter />
      </div>
  </DynamicLayout>
  );
};
