import React, { useState, useMemo } from 'react';
import Button from '../Button/Button';
import './DataTable.css';

const DataTable = ({ columns, data, keyField = 'id', itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // BUG-019 / REGRESSION-006: Reset to page 1 when actual data content changes, not reference
  const dataSignature = useMemo(() => {
    return data ? data.map(item => item[keyField]).join(',') : '';
  }, [data, keyField]);

  const [prevSignature, setPrevSignature] = useState(dataSignature);
  if (dataSignature !== prevSignature) {
    setPrevSignature(dataSignature);
    setCurrentPage(1);
  }

  const paginatedData = useMemo(() => {
    if (!data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.ceil(data.length / itemsPerPage);
  }, [data, itemsPerPage]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (!data || data.length === 0) {
    return (
      <div className="table-empty-state">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="table-responsive custom-data-table-container">
      <table className="custom-data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col, index) => (
                <td key={index}>
                  {col.render ? col.render(row[col.field], row) : row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="table-pagination" style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 24px', gap: '8px', borderTop: '0.8px solid var(--border-color)' }}>
          <Button variant="secondary" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
          <span style={{ fontSize: '13px', alignSelf: 'center', color: 'var(--text-muted)' }}>Page {currentPage} of {totalPages}</span>
          <Button variant="secondary" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(DataTable);
