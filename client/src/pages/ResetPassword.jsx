import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import './ResetPassword.css';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/v1/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/v1/api/auth/reset-password`,
        { email, otp, newPassword }
      );
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Auth Logo fixed at top-left */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="auth-logo"
      />

      {/* Main Container */}
      <div className="reset-password-container">
        {/* Email Form */}
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail}>
            <h1>Reset Password</h1>
            <p>Enter your registered email address</p>
            <div className="input-group">
              <img src={assets.mail_icon} alt="mail icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Send</button>
          </form>
        )}

        {/* OTP Form */}
        {!isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitOtp}>
            <h1>Reset Password OTP</h1>
            <p>Enter the 6-digit code sent to your email</p>
            <div className="otp-group" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    required
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
            <button type="submit">Submit</button>
          </form>
        )}

        {/* New Password Form */}
        {isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitNewPassword}>
            <h1>New Password</h1>
            <p>Enter your new password</p>
            <div className="input-group">
              <img src={assets.lock_icon} alt="lock icon" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
