import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Login from './Login';
import SignUp from './SignUp';

import axios from 'axios';

function Auth(props) {
  const [isLoginScreen, setIsLoginScreen] = useState(props.isLogin);
  const navigate = useNavigate();

  return (
    <>
      {/* 認証画面 */}
      {isLoginScreen ? (
        <Login
          onLogin={(email, password, failureCallback) => {
            // ログイン処理
            console.log('Logging in:', email, password);
            axios.post('http://localhost:5000/api/auth/login', {
              email: email,
              password: password
            }).then((res) => {
              console.log("Login succeeded");
              localStorage.setItem('token', res.data.token);
              navigate('/tasks');
            }).catch(failureCallback)
          }}
          switchToSignUp={() => setIsLoginScreen(false)}
        />
      ) : (
        <SignUp
          onSignUp={(displayName, email, password, failureCallback) => {
            // ユーザー登録処理
            console.log('Signing up:', displayName, email, password);
            axios.post('http://localhost:5000/api/auth/signup', {
              displayName: displayName,
              email: email,
              password: password
            }).then((res) => {
              console.log("Sign up succeeded");
              localStorage.setItem('token', res.data.token);
              navigate('/tasks');
            }).catch(failureCallback);
          }}
          switchToLogin={() => setIsLoginScreen(true)}
        />
      )}
    </>
  );
}

export default Auth;
