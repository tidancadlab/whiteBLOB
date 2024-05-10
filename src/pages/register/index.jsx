import React, { useState } from 'react';
import { PATH } from '../../config';

const RegisterPage = () => {
  const [userData, setUserData] = useState({ email: '', password: '', fullName: '', gender: '' });
  const [errors, setErrors] = useState({ email: '', password: '', fullName: '', gender: '' });
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleRegistration = () => {
    console.log('register');
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

    xhr.open('POST', `${PATH.API_PATH}api/auth/register`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(userData));
  };

  return (
    <div className="container mx-auto mt-2 max-w-md text-white">
      <h2 className="mb-4 text-2xl font-semibold">User Registration</h2>
      <div>
        <label className="mb-2 block " htmlFor="email">
          Email:
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          className={`w-full border bg-gray-900 p-2 ${errors.email ? 'border-red-500' : 'border-gray-900'} mb-4 rounded`}
        />
        {errors.email && <p className="-mt-4 text-sm text-red-500   ">{errors.email}</p>}
      </div>
      <div>
        <label className="mb-2 block " htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          className={`w-full border bg-gray-900 p-2 ${errors.password ? 'border-red-500' : 'border-gray-900'} mb-4 rounded`}
        />
        {errors.password && <p className="-mt-4 text-sm text-red-500    ">{errors.password}</p>}
      </div>
      <div>
        <label className="mb-2 block " htmlFor="fullName">
          Full Name:
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={userData.fullName}
          onChange={handleChange}
          className={`w-full border bg-gray-900 p-2 ${errors.fullName ? 'border-red-500' : 'border-gray-900'} mb-4 rounded`}
        />
        {errors.fullName && <p className="-mt-4 text-sm text-red-500    ">{errors.fullName}</p>}
      </div>
      <button
        type="button"
        onClick={handleRegistration}
        className="focus:shadow-outline-blue w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none">
        Register
      </button>
      {registrationStatus && (
        <div className={`mt-4 p-2 ${registrationStatus.success ? 'bg-green-200' : 'bg-red-200'} rounded text-gray-800`}>{registrationStatus.message}</div>
      )}
    </div>
  );
};

export default RegisterPage;
