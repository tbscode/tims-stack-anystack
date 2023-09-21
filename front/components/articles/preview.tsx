const dynamicCardBaseStyles = `flex flex-col transition-all w-full h-64 sm:h-64 lg:w-120 lg:h-72 bg-base-300 rounded-xl justify-center justify-self-center content-center shadow-xl border-natural-content border-solid border`;
const cardGradientStyle = `tansition-all bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-blue-800 hover:via-indigo-500 hover:to-purple-500 hover:text-base-200`;
import { ArticleHeader } from "./preview-header";
import { ArticleTagBar } from "./preview-tag-bar";
import { ArticleContent } from "./preview-content";
import { ArticleFooter } from "./preview-footer";
import Draggable from 'react-draggable';
import { useEffect, useRef, useState } from "react";

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
    style = `${style} xl:h-20`;  
  }
  
  if(beingDragged) {
    style = `${style} z-150`;  
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
        articleHeader,
        articleBaseContent
       }) => {
    return <Draggable 
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
          {articleHeader}
          {articleBaseContent}
        </div>
    </Draggable>
};

const OverflowHandler = ({dragging, isTop, overflowRef, expand}) => {
  const hidden = true;
  // this basicly has one detection and one expansion element
  let style = `absolute w-52 bg-error z-140 h-8 pointer-events-none`;
  if(isTop) {
    style = `${style} bg-info`;  
  }else{
    style = `${style} -mt-10`;
  }
  if(dragging) {
    style = `${style} hidden`;
  }
  
  if(hidden){
    style = `${style} bg-transparent`;
  }
  return <>
    <div className={style} ref={overflowRef}></div>
    {expand && <div className="w-full bg-accent"></div>}
  </>
}


export const ReadLaterListArticlePreview = ({ article, articleController, readLaterListRef, readLaterItemRefs }) => {
  const dragRef = useRef(null);
  const [previewCollapsed, setPreviewCollapsed] = useState(true);
  const [articleDragging, setArticleDragging] = useState(false);
  const topOverflowRef = useRef(null);
  const bottomOverflowRef = useRef(null);
  
  const onMouseEnter = () => {};

  const onMouseLeave = () => {};
  
  const onDrag = () => {
    if(!articleDragging){
      setArticleDragging(true);
    }
    
    // Now we want to check if this overlaps with any of the other articles overflow handlers
    Object.keys(readLaterItemRefs.current).forEach((key) => {
      const { topOverflowRef, bottomOverflowRef } = readLaterItemRefs.current[key];
      if(topOverflowRef.current && bottomOverflowRef.current){
        const topOverflowRect = topOverflowRef.current.getBoundingClientRect();
        const bottomOverflowRect = bottomOverflowRef.current.getBoundingClientRect();
        //areOverlapping(topOverflowRect, );
      }
    });
  };
  
  const onStopDrag = () => {
    if(articleDragging){
      setArticleDragging(false);
    }
  }
  
  let baseSyles = getArticleBaseStyles({
    hoverId: articleController.hoverController.hoverId,
    articleId: article.uuid,
    hoverTag: articleController.hoverController.hoverTag,
    articleTags: article.tags,
    collapsed: previewCollapsed,
    otherArticleDragged: false,
    beingDragged: false,
  });
  
  useEffect(() => {
    readLaterItemRefs.current = { ...readLaterItemRefs.current ,[article.uuid]: {
      topOverflowRef,
      itemRef: dragRef,
      bottomOverflowRef,
    }};
    console.log("ITEM REFS ", readLaterItemRefs.current);
  },[]);
  
  useEffect(() => {
    // runs after the components renders so will have access too the ref
    if(dragRef.current){
      if('initalTransform' in article){
        dragRef.current.style.transform = article.initalTransform;
      }
    }
  }, []);

  return (<>
      <OverflowHandler dragging={articleDragging} isTop={true} overflowRef={topOverflowRef} expand={false}/>
      <BaseArticlePreview 
        article={article}
        dragRef={dragRef}
        onStopDrag={onStopDrag}
        onDrag={onDrag}
        baseSyles={`2xl:h-20 xl:h-20 ${baseSyles} xl:w-52 xl:h-20 lg:h-20 lg:w-52 sm:h-20 h-20 mb-2`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        articleHeader={<ArticleHeader 
          article={article} 
          articleHeaderClassName="mt-0 mb-0"
          articleHeaderTitleClassName="text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl 3xl:text-2xl" />}
        articleBaseContent={<></>} />
      <OverflowHandler dragging={articleDragging} isTop={false} overflowRef={bottomOverflowRef} expand={false}/>
    </>);
};

const areOverlapping = (ref1, ref2) => {
  const r1 = ref1.current.getBoundingClientRect();
  const r2 = ref2.current.getBoundingClientRect();
  let overlap = !(r1.right < r2.left || 
          r1.left > r2.right || 
          r1.bottom < r2.top || 
          r1.top > r2.bottom)
  return overlap;
}

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
    let overlap = areOverlapping(dragRef, readLaterListRef);
    if(overlap){
      console.log("OVERLAP");  
    }
    if(!articleController.dragController.draggingPreview){
      articleController.dragController.setDraggingPreview(article.uuid);
    }
    if(overlap && !previewCollapsed){
      setPreviewCollapsed(true);
      articleController.dragController.setDraggingArticleOverlapDropZone(true)
    } else if(!overlap && previewCollapsed){
      setPreviewCollapsed(false);
      articleController.dragController.setDraggingArticleOverlapDropZone(false)
    }  
  };
  
  const onStopDrag = (e, data) => {

    // then if there is overlap also add it to the read later list
    let overlap = areOverlapping(dragRef, readLaterListRef);
    console.log("DROP", "overlapping", overlap)
    if(overlap){
      articleController.dragController.addReadLaterArticleViaDrop(article, dragRef);
    }

    if(dragRef.current){
      // if released while not on hover area just transform back to original position
      dragRef.current.style.transform = `translate(0px, 0px)`;
    }
        
    if(articleController.dragController.draggingPreview){
      articleController.dragController.setDraggingPreview(null);
    }
    
    if(previewCollapsed){
      setPreviewCollapsed(false);
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
        articleHeader={<ArticleHeader article={article} />}
        articleBaseContent={
          <BaseArticlePreviewContent 
            article={article}
            articleController={articleController}
            previewCollapsed={previewCollapsed}
          />
        } />);
};