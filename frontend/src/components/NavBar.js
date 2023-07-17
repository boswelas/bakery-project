import Link from "next/link";
import styles from "../styles/navbar.module.css";
import { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import { useAuth, signUpWithEmail } from '@/components/AuthContext.js';

const NavBar = () => {
    const { user, login, logout, signUpWithEmail } = useAuth();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        signUpWithEmail(email, password);

        // Reset the form fields
        setEmail('');
        setPassword('');
    };


    return (
        <header className={styles.navbar}>
            <nav className={styles["navbar-nav"]}>
                <Link href="/"><div className={styles["navbar-link"]}>Bakery</div></Link>
                <Link href="/menu" className={styles["navbar-link"]}>Menu</Link>
                <Link href="/about" className={styles["navbar-link"]}>About</Link>
                {user ? (
                    <>
                        <div>
                            <div>
                                <h4>Welcome {user.displayName}</h4>
                                <Link href="/">
                                    <span className={styles.SignOutLink} onClick={logout}>Sign out</span>
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <Button onClick={handleOpen}>Open modal</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <div className={styles.Modal}>
                                <form onSubmit={handleSubmit}>
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" id="email" value={email} onChange={handleEmailChange} />

                                    <label htmlFor="password">Password:</label>
                                    <input type="password" id="password" value={password} onChange={handlePasswordChange} />

                                    <button type="submit">Sign Up</button>
                                </form>
                            </div>
                        </Modal>
                    // <Link href="/">
                    //     <span onClick={login}>Log In</span>
                    // </Link>
                    </div>)}
            </nav>
        </header>)
}

export default NavBar;