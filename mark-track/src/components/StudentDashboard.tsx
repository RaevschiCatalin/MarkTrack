"use client";

export default function StudentDashboard() {
    return (
        <div className="flex flex-row pt-20 h-screen overflow-y-auto">
            <div className="sm:w-full sm:max-w-[18rem]">
            <input type="checkbox" id="sidebar-mobile-fixed" className="sidebar-state hidden" />
                <label htmlFor="sidebar-mobile-fixed" className="sidebar-overlay"></label>
                <aside className="sidebar sidebar-sticky sidebar-mobile h-full max-sm:fixed max-sm:-translate-x-full py-4 bg-gray-100 shadow-md">
                    <section className="sidebar-title items-center p-4">
                        <h1 className="text-primary text-pretty text-xl font-bold">Welcome, user!</h1>
                    </section>
                    <section className="sidebar-content">
                        <nav className="menu rounded-md">
                            <section className="menu-section px-4">
                                <h2 className="menu-title">Classes</h2>
                                <ul className="menu-items space-y-2">
                                    <li>
                                        <button>
                                            Subject Name 1
                                        </button>
                                    </li>
                                    <li>
                                        <button>
                                            Subject Name 2
                                        </button>
                                    </li>
                                    <li>
                                        <button>
                                            Subject Name 3
                                        </button>
                                    </li>
                                </ul>
                            </section>
                            <div className="divider my-0"></div>
                            <section className="menu-section px-4">
                                <h2 className="menu-title">Grades</h2>
                                <ul className="menu-items space-y-2">
                                    <li>
                                        <button>
                                            All Grades
                                        </button>
                                    </li>
                                    <li>
                                        <button>
                                            Subject Name 1
                                        </button>
                                    </li>
                                    <li>
                                        <button>
                                            Subject Name 2
                                        </button>
                                    </li>
                                    <li>
                                        <button>
                                            Subject Name 3
                                        </button>
                                    </li>
                                </ul>
                            </section>
                        </nav>
                    </section>
                </aside>
            </div>

            <div className="flex w-full flex-col p-4">
                {/* Buton pentru mobil */}
                <div className="w-fit">
                    <label htmlFor="sidebar-mobile-fixed" className="btn btn-solid-primary sm:hidden ripple">
                        Dashboard
                    </label>
                </div>

                <div className="my-4 grid grid-cols-2 gap-4">
			        <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>

			        <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
			        <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
			        <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
			        <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
			        <div className="flex h-40 w-full items-center justify-center border-2 border-dashed border-border bg-gray-1">+</div>
		        </div>
            </div>
        </div>
    );
}