import LoginPage from "../Pages/LoginPage";

function Auth({ children, options }) {
    const token = window.localStorage.getItem('token');
    return (
        token ? children : <LoginPage />
    );
}

export default Auth;