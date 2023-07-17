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
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    };

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const uid = result.user.uid;
            const email = result.user.email;
            const displayName = result.user.displayName;
            console.log(uid, email, displayName);
            const response = await fetch(
                // 'https://travel-planner-production.up.railway.app/login', 
                'http://localhost:5001/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ uid: uid, email: email, displayName: displayName }),
                });
            response.json();
            console.log(response
            );
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
