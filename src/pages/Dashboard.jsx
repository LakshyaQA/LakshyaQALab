import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ScenarioPanel from '../components/sandbox/ScenarioPanel';
import DebugConsole from '../components/sandbox/DebugConsole';

const Dashboard = () => {
  const { isAuthenticated, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8 pb-24 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QA Automation Lab</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Authenticated Session Active
              </p>
            </div>
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2 border-2 border-rose-500 text-rose-500 font-medium rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              data-testid="logout-btn"
            >
              Logout
            </button>
          </header>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
               <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
               Session Token
            </h2>
            <p className="text-sm break-all font-mono bg-gray-100 dark:bg-slate-700 p-3 rounded-lg border border-gray-200 dark:border-slate-600">
              {token}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center h-48 text-center bg-gray-50/50 dark:bg-slate-800/50">
              <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Advanced Table Component</span>
              <span className="text-xs text-blue-500 mt-2 font-mono">Coming Soon</span>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center h-48 text-center bg-gray-50/50 dark:bg-slate-800/50">
               <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="text-gray-500 dark:text-gray-400 font-medium">File Upload Zone</span>
              <span className="text-xs text-blue-500 mt-2 font-mono">Coming Soon</span>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center h-48 text-center bg-gray-50/50 dark:bg-slate-800/50">
              <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Chaos Form Builder</span>
              <span className="text-xs text-blue-500 mt-2 font-mono">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
      <ScenarioPanel />
      <DebugConsole />
    </>
  );
};

export default Dashboard;
