import Link from 'next/link'

export const ChatMessages = ({state}) => {
  return <div className='bg-accent text-accent-content rounded-box flex items-center p-4 shadow-xl'>
    <div className='flex-1'>{JSON.stringify(state)}</div>
  </div>
  
}


export const ChatsList = ({}) => {
  const chats = [
    {uuid: "0", name: "Chat 1"}
  ]
  return <div></div>
}

export const MainNavigation = ({children}) => {
  const navItems = [
    {id: "index", text: "Index", href: "/"},
    {id: "profile", text: "Profile", href: "/profile"},
  ]

  return (<div className="drawer">
  <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
  <div className="drawer-content flex flex-col">
    <div className="w-auto navbar bg-base-300 mr-3 ml-3 mt-3 rounded-xl">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div> 
      <div className="flex-1 px-2 mx-2">Navbar Title</div>
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal">
            {navItems.map((item) => (
                <li key={item.id} className='bg-primary rounded-xl ml-1'>
                  <Link href={item.href}>{item.text}</Link>
                </li>
              ))}
        </ul>
      </div>
    </div>
    {children}
  </div> 
  <div className="drawer-side">
    <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
    <ul className="menu p-4 w-80 bg-base-100 rounded-xl h-96 mt-20 ml-4">
        {navItems.map((item) => (
            <li key={item.id} className='bg-primary rounded-xl ml-1'>
              <Link href={item.href}>{item.text}</Link>
            </li>
          ))}
    </ul>
    
  </div>
</div>)
}