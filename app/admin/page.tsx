'use client';

import React, { useState, useEffect } from 'react';

interface CodeData {
  code: string;
  generatedAt: number;
  expiresAt: number;
  isValid: boolean;
}

const AdminPage = () => {
  const [codeData, setCodeData] = useState<CodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generateCode');
      if (!res.ok) {
        throw new Error('Failed to generate code');
      }
      const data = await res.json();
      setCodeData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (codeData) {
      navigator.clipboard.writeText(codeData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!codeData) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingTime = Math.max(
        Math.ceil((codeData.expiresAt - now) / 1000),
        0
      );
      setTimeLeft(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [codeData]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
      <button
        onClick={handleGenerateCode}
        className="mb-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
      >
        {loading ? 'Generating...' : 'Generate Secure Code'}
      </button>

      {codeData && (
        <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-8 shadow-lg flex flex-col items-center">
          <p className="text-xl mb-4">
            <strong>Secure Code:</strong>
          </p>
          <div
            onClick={handleCopy}
            className="text-4xl font-mono bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition duration-200 select-all"
          >
            {codeData.code}
          </div>
          {copied && (
            <span className="mt-2 text-sm text-green-400">
              Code copied to clipboard!
            </span>
          )}
          <p className="mt-6 text-lg">
            <strong>Time Remaining:</strong> {timeLeft} seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
