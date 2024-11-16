"use client"

export default function Dashboard() {
    return(
        <div className="flex flex-row pt-20 h-screen overflow-y-auto">
            <div className="sm:w-full sm:max-w-[18rem]">
            <input type="checkbox" id="sidebar-mobile-fixed" className="sidebar-state" />
            <label htmlFor="sidebar-mobile-fixed" className="sidebar-overlay"></label>
            <aside className="sidebar sidebar-sticky sidebar-mobile h-full max-sm:fixed max-sm:-translate-x-full py-4">
                <section className="sidebar-title items-center p-4">
                    <h1 className="text-warning text-pretty text-xl">Dashboard</h1>
                </section>
                <section className="sidebar-content">
                    <nav className="menu rounded-md">
                        <section className="menu-section px-4">
                            <ul className="menu-items">
                                <li className="menu-item text-primary text-base">Class Name</li>
                                <li className="menu-item text-primary text-base">Class Name</li>
                                <li className="menu-item text-primary text-base">Class Name</li>
                            </ul>
                        </section>
                    </nav>
                </section>
            </aside>
            </div>
            <div className="flex w-full flex-col p-4">
                <div className="w-fit">
                    <label htmlFor="sidebar-mobile-fixed" className="btn-solid-primary btn sm:hidden text-black">
                        Dashboard
                    </label>
		        </div>

		        <div className="my-4 grid grid-rows-1 gap-4">
			        <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                    <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                    <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
                </div>
            </div>
        </div>
    )
}