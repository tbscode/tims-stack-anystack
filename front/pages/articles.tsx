import { useRouter } from "next/router";
import {
  handleStreamedProps,
  getCookiesAsObject,
  getEnv,
} from "@/utils/tools";
import { useSelector, useDispatch } from "react-redux";
import { ArticleFeed } from "@/components/articles/article-feed";

export const getServerSideProps = async ({ req }: { req: any }) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({ req });
    console.log("RES", res);
    return { props: { data: JSON.parse(res), dataLog: { pulled: true } } };
  }
  return { props: { dataLog: { pulled: false } } };
};

export default function Index(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const frontendSettings = useSelector((state: any) => state.frontendSettings);

  return (
    <div className="flex items-center content-center flex-col">
      <ArticleFeed />
    </div>
  );
}
