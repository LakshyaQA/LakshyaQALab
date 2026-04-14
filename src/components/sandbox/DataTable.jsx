import React, { useState, useEffect, useMemo } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { useLogger } from '../../context/LoggerContext';

const fakeData = Array.from({ length: 45 }, (_, i) => ({
  id: `USR-${1000 + i}`,
  name: `Test User ${i + 1}`,
  role: i % 3 === 0 ? 'Admin' : i % 5 === 0 ? 'Tester' : 'Developer',
  status: i % 4 === 0 ? 'Inactive' : 'Active',
}));

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const rowsPerPage = 5;

  const { mockFetch } = useNetwork();
  const { addLog } = useLogger();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await mockFetch('/api/v1/users');
      setData(fakeData);
    } catch (err) {
      setError(err.message);
      addLog('error', 'Table failed to load data', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Re-fetch only on mount, but could be tied to a refresh button

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    addLog('action', `Table sorted by ${key} (${direction})`);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedData.map(row => row.id));
      addLog('action', 'Table: Selected all loaded rows');
    } else {
      setSelectedRows([]);
      addLog('action', 'Table: Cleared row selection');
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => {
      const newSelection = prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id];
      addLog('action', `Table row ${id} selection toggled`);
      return newSelection;
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col space-y-3 p-4" data-testid="table-loading">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-full"></div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center text-rose-500 bg-rose-50 dark:bg-rose-950/20" data-testid="table-error">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <p className="font-semibold">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300 rounded hover:bg-rose-200 dark:hover:bg-rose-800 transition-colors" data-testid="table-retry-btn">
            Retry Connection
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" data-testid="data-table">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-800 dark:text-gray-300">
            <tr>
              <th scope="col" className="p-4 w-4">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
                  onChange={handleSelectAll}
                  checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                  data-testid="table-select-all"
                />
              </th>
              {['id', 'name', 'role', 'status'].map(key => (
                <th key={key} scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => handleSort(key)} data-testid={`sort-${key}`}>
                  <div className="flex items-center">
                    {key}
                    {sortConfig.key === key && (
                      <svg className={`w-3 h-3 ml-1 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} className="bg-white border-b dark:bg-slate-900 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" data-testid={`row-${row.id}`}>
                <td className="w-4 p-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
                    onChange={() => handleSelectRow(row.id)}
                    checked={selectedRows.includes(row.id)}
                    data-testid={`select-${row.id}`}
                  />
                </td>
                <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white" data-testid={`cell-id-${row.id}`}>{row.id}</td>
                <td className="px-6 py-4" data-testid={`cell-name-${row.id}`}>{row.name}</td>
                <td className="px-6 py-4" data-testid={`cell-role-${row.id}`}>{row.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`} data-testid={`cell-status-${row.id}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedRows([]); // Clear selection on page change by default
    addLog('action', `Table paginated to page ${newPage}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col col-span-1 md:col-span-2 relative h-96">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-gray-800 dark:text-slate-200 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Advanced Data Table
        </h3>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">Component Lab</span>
      </div>
      
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>

      {!loading && !error && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white" data-testid="page-start">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white" data-testid="page-end">{Math.min(currentPage * rowsPerPage, sortedData.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white" data-testid="page-total">{sortedData.length}</span> Entries
          </span>
          <div className="flex space-x-1">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              data-testid="pagination-prev"
            >
              Prev
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              data-testid="pagination-next"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
