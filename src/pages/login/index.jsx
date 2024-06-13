import React, { useState } from 'react';
import logo from 'asset/image/LOGO_314p.png';
import { URL } from 'configuration';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loginResult, setLoginResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setLoginResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    if (formData.email.trim() === '') {
      validationErrors.email = 'email is required';
    }
    if (formData.password.trim() === '') {
      validationErrors.password = 'Password is required';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoginResult(null);
    } else {
      try {
        const response = await fetch(`${URL.API_BASE_URL.WHITE_BLOB}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          setLoginResult({ success: true, ...data });
          window.localStorage.setItem('token', data.token);
          document.cookie = `token=${data.token}`;
          return (window.location = '/');
        } else {
          setLoginResult({ success: false, ...data });
        }
      } catch (error) {
        setLoginResult({ success: false, message: error.message });
        console.error(error);
      }
    }
  };

  return (
    <div className="flex grow items-center justify-center bg-black px-1">
      <div className="w-80 scale-90 rounded-3xl bg-gray-950 p-8 text-white shadow-md duration-150 ease-in-out sm:w-[420px] sm:scale-100 sm:p-10">
        <div className="flex justify-center">
          <img className="h-10 pb-2" src={logo} alt="logo_image" />
        </div>
        <>
          {loginResult && (
            <div className={`mb-4 p-2 ${loginResult.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'} rounded`}>{loginResult.message}</div>
          )}
          <form onSubmit={handleSubmit}>
            <h2 className="mb-4 text-2xl font-semibold">Login</h2>
            <div className="mb-4">
              <label htmlFor="username" className="mb-2 block text-sm font-bold">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border bg-gray-900 p-2 ${errors.username ? 'border-red-500' : 'border-gray-900'} rounded`}
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="mb-2 block text-sm font-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border bg-gray-900 p-2 ${errors.password ? 'border-red-500' : 'border-gray-900'} rounded`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            <button type="submit" className="focus:shadow-outline-blue w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none">
              Login
            </button>
          </form>
        </>
        <p className="mt-4 text-center text-xl"> -- OR -- </p>
        <Link
          to="/register"
          className="focus:shadow-outline-blue mt-4 flex w-full items-center justify-center rounded bg-violet-500 p-2 text-white hover:bg-violet-600 focus:outline-none">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
