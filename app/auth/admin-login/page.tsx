'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  const expectedSecret = 'visyani';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (secret !== expectedSecret) {
      setError('Invalid secret code');
      return;
    }

    localStorage.setItem('isAdmin', 'true');
    router.push('/admin');
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff'
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#000' }}>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{ display: 'block', marginBottom: '0.5rem', color: '#000' }}
          >
            Secret Code:
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret code"
            style={{
              width: '100%',
              padding: '0.5rem',
              boxSizing: 'border-box',
              color: '#000',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
}
