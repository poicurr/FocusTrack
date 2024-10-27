const jwt = require('jsonwebtoken');

// JWTアクセストークン生成関数
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // accessトークンの有効期限
  });
};

// 認証ミドルウェア
function authenticateToken(req, res, next) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    // アクセストークンがない場合
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Missing refresh token. Please log in again.' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFLESH, (err, decodedRefresh) => {
      if (err) {
        return res.status(401).json({ message: 'Refresh token is invalid. Please log in again.' });
      }
      // アクセストークンを再発行する
      const newAccessToken = generateAccessToken(decodedRefresh.id);
      // アクセストークンをHTTP-only Cookieに保存
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: false, // TODO: リリース時にtrue
        sameSite: 'Strict', // CSRF対策
        maxAge: 15 * 60 * 1000 // 15m
      });
      req.user = decodedRefresh;
      next();
    });
    return;
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decodedAccess) => {
    if (err) {
      console.log(`error.name: ${err.name}`);
      if (err.name === 'TokenExpiredError') {
        // アクセストークンの期限切れ(再発行を試みる)
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ message: 'Missing refresh token. Please log in again.' });
        }
  
        jwt.verify(refreshToken, process.env.JWT_REFLESH, (err, decodedRefresh) => {
          if (err) {
            return res.status(401).json({ message: 'Refresh token is invalid. Please log in again.' });
          }
          // アクセストークンを再発行する
          const newAccessToken = generateAccessToken(decodedRefresh.id);
          // アクセストークンをHTTP-only Cookieに保存
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: false, // TODO: リリース時にtrue
            sameSite: 'Strict', // CSRF対策
            maxAge: 15 * 60 * 1000 // 15m
          });
          req.user = decodedRefresh;
          next();
        });
      } else {
        // エラーハンドリングミドルウェアを呼び出す（index.js/app.use((err, req, res, next)）
        next(err);
      }
    } else {
      // 認証OK
      req.user = decodedAccess;
      next();
      return;
    }
  });
}

module.exports = authenticateToken;
