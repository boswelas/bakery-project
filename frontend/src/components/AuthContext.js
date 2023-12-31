import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../components/Firebase';

const provider = new GoogleAuthProvider();

const getToken = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        console.log(token);
        return token;
    } else {
        return null;
    }
};

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUpWithEmail = (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Handle successful user creation
                const user = userCredential.user;
                console.log("User created:", user);
            })
            .catch((error) => {
                // Handle error during user creation
                console.error("Error creating user:", error);
            });
    };
    const signInWithEmail = (email, password) => {
        console.log("signInWithEmailAndPassword function called");
        console.log(email, password);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('made user');
                // ...
            })
            .catch((error) => {
                console.log('caught error: ', error);
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    };

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                console.log('Authentication popup closed by the user');
            } else {
                console.log('Authentication error:', error);
            }
        }
    };

    const logout = async () => {
        setUser(null);
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, googleLogin, logout, getToken, signUpWithEmail, signInWithEmail }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
