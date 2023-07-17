import { useAuth, signUpWithEmail } from '@/components/AuthContext.js';
import { useRouter } from 'next/router';
import { useState } from 'react';


const SignUp = () => {
    const router = useRouter();
    const { user, signUpWithEmail } = useAuth();

    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFirstChange = (e) => {
        setFirst(e.target.value);
    };

    const handleLastChange = (e) => {
        setLast(e.target.value);
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5001/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                first: first,
                last: last,
                phone: phone
            }),
        });
        const data = await response.json();
        console.log(data)
        signUpWithEmail(email, password);
        router.push('/');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="first">First:</label>
                <input type="text" id="first" value={first} onChange={handleFirstChange} />

                <label htmlFor="last">Last:</label>
                <input type="text" id="last" value={last} onChange={handleLastChange} />

                <label htmlFor="phone">Phone:</label>
                <input type="phone" id="phone" value={phone} onChange={handlePhoneChange} />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={handleEmailChange} />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}


export default SignUp;