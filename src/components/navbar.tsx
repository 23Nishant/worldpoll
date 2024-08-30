import React from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <span className={styles.logo}>World Poll</span>
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">
            <span className={styles.navLink}>Farcaster</span>
          </Link>
        </li>
        <li>
          <Link href="/my-polls">
            <span className={styles.navLink}>Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
