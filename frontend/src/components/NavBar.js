import Link from "next/link";

const NavBar = () => {
    return (
        <header>
            <nav>
                <Link href="/"><div>Bakery</div></Link>
                <Link href="/menu">Menu</Link>
                <Link href="/about">About</Link>
                </nav></header>)
}

export default NavBar;