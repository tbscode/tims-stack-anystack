import { useState } from "react";
import { rjsfDaisyUiTheme } from "../rjsf-daisyui-theme/rjsfDaisyUiTheme";
import { withTheme } from "@rjsf/core";
import { get } from "http";
let trackUpdateTime = false;
import validator from "@rjsf/validator-ajv8";

const LOREM = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

const ThemedForm = withTheme(rjsfDaisyUiTheme);


export const ArticleNav = ({}) => {
  return  <div className="navbar bg-base-200 fixed z-80 sm:hidden">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} htmlFor="my-drawer" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 bg-base-300"
          >
            <li>
              <div className="w-52 bg-error h-32">
                Hello
              </div>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </div>
}

export const DynamicLayout = ({children}) => {
  return (
    <div className="drawer absolute z-60">
    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content w-full">
      <ArticleNav />
      <div className="w-full flex flex-col justify-center content-center items-center">
        {children}
      </div>
    </div> 
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
        {/* Sidebar content here */}
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
        
      </ul>
    </div>
  </div>
  );
};

function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function random(seed) {
  // simple adoptions so we get something almost random that is seedable
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}


const BASE_TAGS = ["Kubernetes", "Microk8s", "Django"];

const generateRandomTags = ({ amount, seed }) => {
  const tags = BASE_TAGS;
  return tags
    .sort(() => random(seed) - 0.5)
    .slice(0, Math.floor(random(seed) * 3));
};

const hundretRandomTags = Array.from({ length: 100 }, (_, i) =>
  generateRandomTags({ amount: 3, seed: i }),
);


const generateArticle = ({ i }) => {
  return {
    title: `Article ${i}`,
    uuid: `id-${i}`,
    tags: hundretRandomTags[i],
    description: "This is the first article",
    image: "https://picsum.photos/seed/picsum/200/300",
    author: {
      first_name: "John",
      second_name: "Doe",
      image: "https://picsum.photos/seed/picsum/200/300",
    },
  };
};


const ARTICLES = Array.from({ length: 10 }, (_, i) => generateArticle({ i }));
const dynamicCardBaseStyles = `flex flex-col transition-all w-full h-64 sm:h-64 lg:w-120 lg:h-72 bg-base-300 rounded-xl justify-center justify-self-center content-center shadow-xl border-natural-content border-solid border`;
const gradientTextStyle = `[&::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)] text-5xl h-fit`;

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

  console.log(hoverTag, articleTags, articleTags.includes(hoverTag));

  if (hoverTag !== null && !articleTags.includes(hoverTag)) {
    style = `${style} blur-sm`;
  } else if (hoverTag !== null && articleTags.includes(hoverTag)) {
    style = `${style} border-success border-solid border-2`;
  }
  return style;
};

const cardGradientStyle = `tansition-all bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-blue-800 hover:via-indigo-500 hover:to-purple-500 hover:text-base-200`;

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

export const ArticleHeader = ({ article, articleController }) => {
  return (
    <div className="prose w-full bg-base-200 rounded-xl p-1 pl-4 sm:pl-8">
      <h1 className="mb-0 text-xl sm:text-3xl xl:text-5xl">{article.title}</h1>
      <h4 className="mt-0">subtitle</h4>
    </div>
  );
};

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

export const ArticleContent = ({ article, articleController }) => {
  return <div className="flex flex-grow w-full p-1 pl-4 sm:pl-8 max-h-full overflow-hidden text-gray-700">{LOREM}</div>;
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

const GradientTitle = () => {
  return (
    <span className="inline-grid text-4xl sm:text-8xl font-bold h-fit justify-center justify-self-center h-30 sm:h-40 fixed z-10 animate-pulse">
      <span
        className="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text opacity-70 blur-3xl [-webkit-text-fill-color:transparent] [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]"
        aria-hidden="true"
      >
        Tim's Blog
      </span>
      <span className="[&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]">
        Tim's Blog
      </span>
    </span>
  );
};

export const ArticleFeedHeader = () => {
  return (
    <div className="relative w-full h-64 grid items-center p-4  2xl:mb-10 2xl:mt-10">
      <GradientTitle />
      <div className="stats shadow w-fit justify-center justify-self-center fixed mt-32 z-2 bg-none">
        <div className="stat w-fit">
          <div className="stat-title">Total Page Views</div>
          <div className="stat-value">89,400</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>
    </div>
  );
};

export const ArticleFeedFooter = () => {
  return (
    <div className="relative w-full h-64 grid items-center p-4  2xl:mb-10 2xl:mt-10 rounded-xl border border-2 bg-base-100">
      Hello
    </div>
  );
};


const filterShema = {
  type: "array",
  uniqueItems: true,
  items: {
    type: "string",
    enum: BASE_TAGS,
  },
};


export const ArticleFeedMenuBar = ({articleController}) => {
  const changeChangeForm = ({formData}) => {
    console.log("UPDATED", formData);
    articleController.filterController.setFilters(formData)
  }

  return (
    <div className="hidden sm:flex relative flex flex-row w-full h-32 items-center p-4  2xl:mb-10 2xl:mt-10 rounded-xl border border-2 sticky top-2 z-40 bg-base-100 bg-opacity-90">
      <div className="flex flex-col w-1/3 content-center justify-center text-center items-center pointer-events-auto">
        <span className="font-bold p-1 rounded-xl">Authors</span>
        <ThemedForm
          schema={filterShema}
          extraErrors={{}}
          showErrorList="bottom"
          uiSchema={{
            "ui:submitButtonOptions": {
              norender: true,
            },
          }}
          formData={{}}
          validator={validator}
          onChange={() => {}}
        />
      </div>
      <div className="flex flex-col w-1/3 content-center justify-center text-center items-center pointer-events-auto">
        <span className="font-bold p-1 rounded-xl">Filter</span>
        <ThemedForm
          schema={filterShema}
          extraErrors={{}}
          showErrorList="bottom"
          uiSchema={{
            "ui:submitButtonOptions": {
              norender: true,
            },
          }}
          formData={articleController.filterController.filters}
          validator={validator}
          onChange={changeChangeForm}
        />
      </div>
      <div className="flex flex-col w-1/3 content-center justify-center text-center items-center">
        <span className="font-bold pb-3">Search</span>
        <input
          type="text"
          placeholder="title or phrase"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
    </div>
  );
};

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

export const ArticleFeed = () => {
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
  
  const filterArticles = (article: Article) => {
    if (filters.length === 0) return true
    // must include all filters!
    return filters.every(filter => article.tags.includes(filter))
  }

  return (
    <DynamicLayout>
      <div className="relative w-full 3xl:w-400">
        <ArticleFeedHeader />
        <ArticleFeedMenuBar articleController={articleController}/>
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
