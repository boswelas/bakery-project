import Link from "next/link";
import styles from "../styles/page.module.css";

const NavBar = () => {
    return (
        <header className={styles.navbar}>
            <nav className={styles["navbar-nav"]}>
                <Link href="/"><div className={styles["navbar-link"]}>Bakery</div></Link>
                <Link href="/menu" className={styles["navbar-link"]}>Menu</Link>
                <Link href="/about" className={styles["navbar-link"]}>About</Link>
            </nav></header>)
}

export default NavBar;