import React, { useState } from 'react';

const RegisterPage = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        fullName: '',
        gender: '',
    });

    const [registrationStatus, setRegistrationStatus] = useState(null);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        fullName: '',
        gender: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleRegistration = () => {
        // Perform validation
        let validationErrors = {};
        if (!userData.email.trim()) {
            validationErrors.email = 'Email is required';
        }
        if (!userData.password.trim()) {
            validationErrors.password = 'Password is required';
        }
        if (!userData.fullName.trim()) {
            validationErrors.fullName = 'Full Name is required';
        }
        if (!userData.gender.trim()) {
            validationErrors.gender = 'gender is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Perform registration
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                setRegistrationStatus({ success: true, message: JSON.parse(xhr.responseText).message });
            } else {
                setRegistrationStatus({ success: false, message: JSON.parse(xhr.responseText).message });
            }
        });

        xhr.addEventListener('error', () => {
            setRegistrationStatus({ success: false, message: 'Registration failed. Please try again.' });
        });

        xhr.open('POST', `${process.env.REACT_APP_SERVER_URL}/api/auth/register`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(userData));
    };

    return (
        <div className="container mx-auto mt-2 max-w-md text-white">
            <h2 className="text-2xl font-semibold mb-4">User Registration</h2>
            <div>
                <label className="block mb-2 " htmlFor="email">
                    Email:
                </label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border bg-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-900'} rounded mb-4`}
                />
                {errors.email && <p className="text-red-500 text-sm -mt-4   ">{errors.email}</p>}
            </div>
            <div>
                <label className="block mb-2 " htmlFor="password">
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    className={`w-full p-2 border bg-gray-900 ${errors.password ? 'border-red-500' : 'border-gray-900'} rounded mb-4`}
                />
                {errors.password && <p className="text-red-500 text-sm -mt-4    ">{errors.password}</p>}
            </div>
            <div>
                <label className="block mb-2 " htmlFor="fullName">
                    Full Name:
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleChange}
                    className={`w-full p-2 border bg-gray-900 ${errors.fullName ? 'border-red-500' : 'border-gray-900'} rounded mb-4`}
                />
                {errors.fullName && <p className="text-red-500 text-sm -mt-4    ">{errors.fullName}</p>}
            </div>
            <div>
                <label className="block mb-2 " htmlFor="age">
                    Gender:
                </label>
                <input
                    type="text"
                    id="age"
                    name="gender"
                    value={userData.gender}
                    onChange={handleChange}
                    className={`w-full p-2 border bg-gray-900 ${errors.gender ? 'border-red-500' : 'border-gray-900'} rounded mb-4`}
                />
                {errors.gender && <p className="text-red-500 text-sm -mt-4  ">{errors.gender}</p>}
            </div>
            <button
                type="button"
                onClick={handleRegistration}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            >
                Register
            </button>
            {registrationStatus && (
                <div className={`mt-4 p-2 ${registrationStatus.success ? 'bg-green-200' : 'bg-red-200'} rounded text-gray-800`}>
                    {registrationStatus.message}
                </div>
            )}
        </div>
    );
};

export default RegisterPage;
