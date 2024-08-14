import Link from "next/link";

const Header = () => (
  <header className="px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground border-b border-gray-300">
    <Link href="/" className="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664a1.108 1.108 0 0 1-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0l-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.6 1.6 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821c.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9 9 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
        />
      </svg>
      <span className="ml-2 text-lg font-bold">DAOcast</span>
      <span className="sr-only">DAOcast</span>
    </Link>
    <nav className="ml-auto flex gap-4 sm:gap-6">
      <Link
        href="#"
        className="text-sm font-medium hover:underline underline-offset-4"
      >
        Features
      </Link>
      <Link
        href="#"
        className="text-sm font-medium hover:underline underline-offset-4"
      >
        About
      </Link>
      <Link
        href="#"
        className="text-sm font-medium hover:underline underline-offset-4"
      >
        Contact
      </Link>
    </nav>
  </header>
);

export default Header;
