import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './VerifyEmail.css';   


const VerifyEmail = () => {
  axios.defaults.withCredentials=true;

  const {backendUrl,isLoggedIn,userData,getUserData}=useContext(AppContext);

  const navigate=useNavigate();

  const inputRefs=React.useRef([]);

  const handleInput=(e,index)=>{
    if(e.target.value.length>0 && index<inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }
  }

  const handleKeyDown=(e,index)=>{
    if(e.key==='Backspace' && e.target.value==='' && index>0){
      inputRefs.current[index-1].focus();

    }
  }

  const handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text');
    const pasteArray=paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;
    }
    });
  }

  const onSubmitHandler=async(e)=>{
    try {
      e.preventDefault();
      const otp=inputRefs.current.map(e=>e.value).join('');
      console.log(otp);

      const {data}=await axios .post(`${backendUrl}/v1/api/auth/verify-account`,{otp});
      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/');

      }else{
        toast.error(data.message);
      }
    } catch (error) {

      toast.error(error.message);
    }
  }

  useEffect(()=>{
    isLoggedIn && userData && userData.isAccountVerified && navigate('/');

  },[isLoggedIn,userData])
  return (
   <div>
  <img
    onClick={() => navigate('/')}
    src={assets.logo}
    alt="logo"
    className="auth-logo"
  />

  <div className="verify-email-container">
    <h1>Email Verification</h1>
    <p>Enter the 6 digit code sent to your email</p>

    <form onSubmit={onSubmitHandler}>
      <div className="otp-group" onPaste={handlePaste}>
        {Array(6).fill(0).map((_, index) => (
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
      <button type="submit">Verify Email</button>
    </form>
  </div>
</div>

  )
}

export default VerifyEmail
