import { usePiAuth } from '../hooks/usePiAuth';

export function PiLoginButton() {
  const { authenticate, isAuthenticated, isLoading, error, isPiBrowser, user } = usePiAuth();

  if (!isPiBrowser) {
    return (
      <div className="pi-notice">
        <p>🔶 افتح التطبيق في Pi Browser للمتابعة</p>
        <a href="https://zenithempirecebd4743.pinet.com" target="_blank" rel="noreferrer">
          فتح في Pi Browser
        </a>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <div className="pi-user">✅ مرحباً <strong>{user.username}</strong></div>;
  }

  return (
    <div>
      <button onClick={authenticate} disabled={isLoading}>
        {isLoading ? 'جارٍ التحقق...' : '🔶 تسجيل الدخول بـ Pi'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
