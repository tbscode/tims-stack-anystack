import { useRef, useState } from "react";
import { DynamicLayout } from "./dynamic-layout";
import { SideBarCollapsible } from "./collapsibles";
import { ArticleFeedMenuBar } from "./feed-menu-bar";
import { ArticleFeedHeader } from "./feed-header";
import { ArticleFeedFooter } from "./feed-footer";
import { ArticlePreview, ReadLaterListArticlePreview, LoadMoreCard } from "./preview";
import { ARTICLES } from "./moc";

interface HoverController {
  hoverId: string | null;
  setHoverId: CallableFunction;
  hoverTag: string | null;
  setHoverTag: CallableFunction;
}

interface DragController {
  draggingPreview: null | string;
  setDraggingPreview: CallableFunction;
  dragginArticleOverlapDropZone: boolean;
  setDraggingArticleOverlapDropZone: CallableFunction;
  addReadLaterArticleViaDrop: CallableFunction;
}

interface FilterController {
  filters: string[];
  setFilters: CallableFunction
}

interface ArticleController {
  hoverController: HoverController;
  filterController: FilterController;
  dragController: DragController;
}

export function ArticleReadLaterListDropZone({ articleController, readLaterListRef, readLaterArticles }) {
  let dropZoneStyles = `relative w-full rounded-xl h-32 bg-opacity-80 p-2 pl-7 z-120  rounded-xl border-natural-content border-solid border bg-base-100`
  let dropContainerStyles = `transition-all absolute -translate-x-52 w-52 h-fit top-0 bottom-0 mt-auto mb-auto -left-5 z-120 duration-750`
  
  if(articleController.dragController.draggingPreview) {
  //if(true){ // TODO debug
    dropContainerStyles = `${dropContainerStyles} translate-x-0`  
  }
  
  if(articleController.dragController.dragginArticleOverlapDropZone) {
    dropZoneStyles = `${dropZoneStyles} bg-primary`
  }
  
  if(readLaterArticles.length > 0) {
    dropZoneStyles = `${dropZoneStyles} h-auto`
  }
  return <div className={dropContainerStyles}>
        <div className={dropZoneStyles} ref={readLaterListRef}>
          {readLaterArticles.length === 0 && <div>
            Drag an article here to save it for later reading!
          </div>}
          {readLaterArticles.map((article, i) => {
            return (
              <ReadLaterListArticlePreview
                key={i}
                article={article}
                articleController={articleController}
                readLaterListRef={readLaterListRef}
              />
            );
          })}
        </div>
    </div>
}

export function ArticleFeed() {
  const [readLaterArticles, setReadLaterArticles] = useState([ARTICLES[0]]);
  const [hoveredArticle, setHoveredArticle] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);
  const [filters, setFilters] = useState([]);
  const [draggingPreview, setDraggingPreview] = useState(null);
  const [dragginArticleOverlapDropZone, setDraggingArticleOverlapDropZone] = useState(false);
  const readLaterListRef = useRef(null);
  
  const addReadLaterArticleViaDrop = (article, articleRef) => {
    // no adding if already in clist, check if article with uuid is already in readLaterArticles
    if (readLaterArticles.find((a) => a.uuid === article.uuid)) return;
    
    // now since we added the article via drag we need to add a transform prop to the inital position of the article
    const boundingRect = articleRef.current.getBoundingClientRect();
    articleRef.current.style.transform = `translate(${boundingRect.left}px, ${boundingRect.top}px)`;
    let articleWithInitalTransform = {...article, initalTransform: `translate(0px, 0px)`}

    setReadLaterArticles([...readLaterArticles, article]);

  }

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
    dragController: {
      draggingPreview: draggingPreview,
      setDraggingPreview: setDraggingPreview,
      dragginArticleOverlapDropZone: dragginArticleOverlapDropZone,
      setDraggingArticleOverlapDropZone: setDraggingArticleOverlapDropZone,
      addReadLaterArticleViaDrop: addReadLaterArticleViaDrop, 
    }
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
          content: (<ArticleFeedMenuBar articleController={articleController} inSidebar={true} draggingPreview={draggingPreview}/>)
        },
        {
          title: "Authors 2",
          content: (<ArticleFeedMenuBar articleController={articleController} inSidebar={true} draggingPreview={draggingPreview}/>)
        },
      ]} />}
      articleController={articleController}>
      <div className="relative w-full 3xl:w-400">
        <ArticleFeedHeader />
        <ArticleFeedMenuBar articleController={articleController} inSidebar={false} draggingPreview={draggingPreview}/>
        <div className="grid relative lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-3 gap-4 w-full z-30">
          {ARTICLES.filter(article => filterArticles(article)).map((article, i) => {
            return (
              <ArticlePreview
                key={i}
                article={article}
                articleController={articleController}
                readLaterListRef={readLaterListRef}
              />
            );
          })}
          <LoadMoreCard />
        </div>
        <ArticleFeedFooter />
      </div>
      <ArticleReadLaterListDropZone articleController={articleController} readLaterListRef={readLaterListRef} readLaterArticles={readLaterArticles} />
  </DynamicLayout>
  );
};
