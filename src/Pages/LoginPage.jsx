import React, { useState } from "react";
import logo from "../images/LOGO_314p.png";
import RegisterPage from "./RegisterPage";
const LoginPage = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loginResult, setLoginResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
    setLoginResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    let validationErrors = {};
    if (formData.email.trim() === "") {
      validationErrors.email = "email is required";
    }
    if (formData.password.trim() === "") {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoginResult(null);
    } else {
      try {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }).then((response) => {
          response.json().then((data) => {
            if (response.status === 200) {
              setLoginResult({ success: true, ...data });
              window.localStorage.setItem("token", data.token);
              window.location.href = "/";
            } else {
              setLoginResult({ success: false, ...data });
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="grow flex items-center justify-center bg-black h-screen px-1">
      <div className="bg-gray-950 sm:p-10 p-8 text-white rounded-3xl shadow-md scale-90 sm:scale-100 w-80 sm:w-[420px] ease-in-out duration-150">
        <div className="flex justify-center">
          <img className="pb-2 h-10" src={logo} alt="logo_image" />
        </div>
        {loginResult && (
          <div
            className={`mb-4 p-2 ${
              loginResult.success
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            } rounded`}
          >
            {loginResult.message}
          </div>
        )}
        {isRegistered ? (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-bold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border bg-gray-900 ${
                  errors.username ? "border-red-500" : "border-gray-900"
                } rounded`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-2 border bg-gray-900 ${
                  errors.password ? "border-red-500" : "border-gray-900"
                } rounded`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            >
              Login
            </button>
          </form>
        ) : (
          <RegisterPage />
        )}
        <p className="mt-4 text-center text-xl"> -- OR -- </p>
        <button
          onClick={() => setIsRegistered((previous) => !isRegistered)}
          type="submit"
          className="w-full bg-violet-500 mt-4 text-white p-2 rounded hover:bg-violet-600 focus:outline-none focus:shadow-outline-blue"
        >
          {isRegistered ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
