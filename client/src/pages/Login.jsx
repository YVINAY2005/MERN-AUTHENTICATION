import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import './Login.css';   // <-- make sure you import the CSS file

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
  }, []);


  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      setName("");
      setEmail("");
      setPassword("");  

      if (state === 'Sign Up') {
        const { data } = await axios.post(
          backendUrl + 'v1/api/auth/register',
          { name, email, password }
        );
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendUrl + 'v1/api/auth/login',
          { email, password }
        );
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {/* 🔹 Fixed logo at top-left */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="auth-logo"
      />

      {/* 🔹 Compact login/signup form */}
      <div className="login-container">
        <h2>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

        <form className="login-form" onSubmit={onSubmitHandler} autoComplete='off'>
          {state === 'Sign Up' && (
            <div className="input-group">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                required
                autoComplete='off'
              />
            </div>
          )}

          <div className="input-group">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              required
              autoComplete='off'
            />
          </div>

          <div className="input-group">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              autoComplete="new-password"
              
            />
          </div>

          <p className="forgot-password" onClick={() => navigate('/reset-password')}>
            Forgot Password?
          </p>

          <button type="submit">{state}</button>
        </form>

        {/* 🔹 Switch between Sign Up and Login */}
        {state === 'Sign Up' ? (
          <div className="switch-auth">
            <p>Already have an account?</p>
            <span onClick={() => setState('Login')}>Login here</span>
          </div>
        ) : (
          <div className="switch-auth">
            <p>Don’t have an account?</p>
            <span onClick={() => setState('Sign Up')}>Sign Up</span>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
