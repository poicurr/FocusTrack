import axios from 'axios';

const PrivateRoute = ({ children }) => {
  // アクセストークンの期限チェック
  axios.get('http://localhost:5000/api/auth/check-auth', {
    withCredentials: true
  }).catch((error) => {
    if (error.status === 401) {
      // 認証エラー(401 Unauthorized)
      window.location.href = '/login';
    }
  });
  return children;
};

export default PrivateRoute;
