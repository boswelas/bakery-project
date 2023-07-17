import Link from "next/link";
import styles from "../styles/page.module.css";
import { useAuth } from '@/components/AuthContext.js';

const NavBar = () => {
    const { user, login, logout } = useAuth();
    return (
        <header className={styles.navbar}>
            <nav className={styles["navbar-nav"]}>
                <Link href="/"><div className={styles["navbar-link"]}>Bakery</div></Link>
                <Link href="/menu" className={styles["navbar-link"]}>Menu</Link>
                <Link href="/about" className={styles["navbar-link"]}>About</Link>
                <Link href="/" className={styles["navbar-link"]}><span onClick={login}>Log In</span></Link>
            </nav></header>)
}

export default NavBar;