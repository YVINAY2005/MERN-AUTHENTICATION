import React, { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sendVerifyOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/v1/api/auth/send-verify-otp`);
      if (data.success) {
        navigate('/verify-email');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/v1/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/login');
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <img src={assets.logo} alt="Logo" />

      <div className="navbar-right">
        {userData ? (
          <div
            className="user-avatar"
            ref={dropdownRef}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {userData.name[0].toUpperCase()}
            {dropdownOpen && (
              <div className="dropdown">
                <ul>
                  {!userData.isAccountVerified && (
                    <li className="verifyEmail" onClick={sendVerifyOtp}>Verify Email</li>
                  )}
                  <li className="logout" onClick={logout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate('/login')}>
            Login <img src={assets.arrow_icon} alt="arrow" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
