const dynamicCardBaseStyles = `flex flex-col transition-all w-full h-64 sm:h-64 lg:w-120 lg:h-72 bg-base-300 rounded-xl justify-center justify-self-center content-center shadow-xl border-natural-content border-solid border`;
const cardGradientStyle = `tansition-all bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-blue-800 hover:via-indigo-500 hover:to-purple-500 hover:text-base-200`;
import { ArticleHeader } from "./preview-header";
import { ArticleTagBar } from "./preview-tag-bar";
import { ArticleContent } from "./preview-content";
import { ArticleFooter } from "./preview-footer";
import Draggable from 'react-draggable';
import { useRef, useState } from "react";

const getArticleBaseStyles = ({
  hoverId,
  articleId,
  articleTags,
  hoverTag,
  collapsed,
  otherArticleDragged,
  beingDragged,
}) => {
  let style = ``;
  if (hoverId === articleId) {
    style = `${dynamicCardBaseStyles} scale-105 border-primary border-solid border-2`;
  } else if (hoverId !== articleId && hoverId !== null) {
    style = `${dynamicCardBaseStyles} scale-95`;
  } else {
    style = dynamicCardBaseStyles;
  }
  
  if(otherArticleDragged) {
    style = `${style} blur-sm`;
  }

  if (hoverTag !== null && !articleTags.includes(hoverTag)) {
    style = `${style} blur-sm`;
  } else if (hoverTag !== null && articleTags.includes(hoverTag)) {
    style = `${style} border-success border-solid border-2`;
  }
  
  if (collapsed) {
    style = `${style} xl:h-32`;  
  }
  
  if(beingDragged) {
    style = `${style} z-140`;  
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

export const BaseArticlePreviewContent = ({ 
    article, 
    articleController, 
    previewCollapsed }) => {
  return !previewCollapsed && <>
            <ArticleTagBar article={article} articleController={articleController} />
            <ArticleContent article={article} articleController={articleController} />
            <ArticleFooter article={article} articleController={articleController} />
          </>
}

export const BaseArticlePreview = ({ 
        article, 
        dragRef, 
        onStopDrag, 
        onDrag, 
        baseSyles, 
        onMouseEnter, 
        onMouseLeave, 
        articleController,
        articleBaseContent
       }) => {
      <Draggable 
        position={{x: 0, y: 0}}
            nodeRef={dragRef}
          defaultClassName={`transition-none`} 
          defaultClassNameDragging="transition-none"
          onDrag={onDrag}
          onStop={onStopDrag}
          >
        <div
            ref={dragRef}
          className={baseSyles}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <ArticleHeader article={article} articleController={articleController} />
          {articleBaseContent}
        </div>
    </Draggable>
};

export const ArticlePreview = ({ article, articleController, readLaterListRef }) => {
  const dragRef = useRef(null);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

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
    collapsed: previewCollapsed,
    otherArticleDragged: (articleController.dragController.draggingPreview !== null) && (articleController.dragController.draggingPreview !== article.uuid),
    beingDragged: articleController.dragController.draggingPreview === article.uuid,
  });
  
  const onDrag = (e, data) => {
    const r1 = dragRef.current.getBoundingClientRect();
    const r2 = readLaterListRef.current.getBoundingClientRect();
    let overlap = !(r1.right < r2.left || 
            r1.left > r2.right || 
            r1.bottom < r2.top || 
            r1.top > r2.bottom)
    if(overlap){
      console.log("OVERLAP");  
    }
    if(!articleController.dragController.draggingPreview){
      articleController.dragController.setDraggingPreview(article.uuid);
    }
    if(overlap && !previewCollapsed){
      setPreviewCollapsed(true);
      articleController.dragController.setDraggingArticleOverlapDropZone(false)
    } else if(!overlap && previewCollapsed){
      setPreviewCollapsed(false);
      articleController.dragController.setDraggingArticleOverlapDropZone(true)
    }
  };
  
  const onStopDrag = (e, data) => {
    console.log("REF", dragRef.current);
    if(dragRef.current){
      // if released while not on hover area just transform back to original position
      dragRef.current.style.transform = `translate(0px, 0px)`;
    }
        
    if(articleController.dragController.draggingPreview){
      articleController.dragController.setDraggingPreview(null);
    }
  }
  

  // return the base article preview
  return (<BaseArticlePreview 
        article={article}
        dragRef={dragRef}
        onStopDrag={onStopDrag}
        onDrag={onDrag}
        baseSyles={baseSyles}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        articleController={articleController}
        articleBaseContent={
          <BaseArticlePreviewContent 
            article={article}
            articleController={articleController}
            previewCollapsed={previewCollapsed}
          />
        } />);
};