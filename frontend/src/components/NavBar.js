import Link from "next/link";
import styles from "../styles/page.module.css";
import { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import { useAuth } from '@/components/AuthContext.js';

const NavBar = () => {
    const { user, login, logout } = useAuth();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Text in a modal
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                                </Typography>
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