import { LOREM } from "./moc"

export const ArticleContent = ({ article, articleController }) => {
  return <div className="flex flex-grow w-full p-1 pl-4 sm:pl-8 max-h-full overflow-hidden text-gray-700">{LOREM}</div>;
};