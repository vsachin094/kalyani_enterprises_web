import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminLogin } from '@/lib/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminLogin(username, password);
      localStorage.setItem('ke-admin-token', result.access_token);
      navigate('/admin');
    } catch (err) {
      setError('Invalid admin username or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-24">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <LogIn className="h-10 w-10 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-950">Admin sign-in</h1>
            <p className="mt-2 text-sm text-gray-600">Enter your admin credentials to manage the site.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
              placeholder="Admin username"
              required
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
              placeholder="Admin password"
              required
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </section>
  );
}