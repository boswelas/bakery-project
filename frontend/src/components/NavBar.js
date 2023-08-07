import Link from "next/link";
import styles from "../styles/navbar.module.css";
import { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import { useAuth, signInWithEmail } from '@/components/AuthContext.js';
import { useRouter } from 'next/router';

const NavBar = () => {
    const router = useRouter();
    const { user, login, logout, signInWithEmail, getToken } = useAuth();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setdisplayName] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await getToken();
        const response = await fetch(
            'http://localhost:5001/checkUser',
            // 'https://bakery-project-production.up.railway.app/checkUser',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email: email }),
            });
        const data = await response.json();
        if (data.user == 'none') {
            handleClose();
            router.push('/signUp');
        } else {
            signInWithEmail(email, password);
            handleClose();
            setdisplayName(data.user[0][1]);
            console.log(data.role)
        }

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
                                <h4>Welcome {displayName}</h4>
                                <Link href="/">
                                    <span className={styles.SignOutLink} onClick={logout}>Sign out</span>
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <Button onClick={handleOpen}>Log In</Button>
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

                                    <button type="submit">Sign In</button>
                                </form>
                            </div>
                        </Modal>
                    </div>)}
            </nav>
        </header>)
};

export default NavBar;