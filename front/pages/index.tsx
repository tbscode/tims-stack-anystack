import Image from 'next/image'
import { handleStreamedProps, getCookiesAsObject, fetchDataOrLoadCache } from "../utils/tools";




export const getServerSideProps = async ({req} : {req: any}) => {
  if (req.method == "POST") {
    const res = handleStreamedProps({req})
    return { props: { data: JSON.parse(res) } };
  }
  return { props: {} };
};


export default function Index({ state, setState, updateTheme }): JSX.Element {
  //hello alter
  console.log("STATE", state);
  fetchDataOrLoadCache({ state, setState })

  return (<h1>
    <button className="btn">Hello daisyUI</button>
    <button className="btn btn-primary">data: {JSON.stringify(state)}</button>
    </h1>);
}
