import NavBar from '../components/NavBar';

const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            {children}
        </>
    );
};

export default Layout;
