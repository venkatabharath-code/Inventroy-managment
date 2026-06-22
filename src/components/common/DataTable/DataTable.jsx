import { useState } from 'react';
import Button from '../Button/Button';
import './DataTable.css';
const DataTable = ({ columns, data, keyField = 'id', itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  // Reset to page 1 when the dataset changes
  const dataSignature = data ? data.map(item => item[keyField]).join(',') : '';
  const [prevSignature, setPrevSignature] = useState(dataSignature);
  if (dataSignature !== prevSignature) {
    setPrevSignature(dataSignature);
    setCurrentPage(1);
  }
  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data ? data.slice(startIndex, startIndex + itemsPerPage) : [];
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
        <div className="table-pagination">
          <Button variant="secondary" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span className="table-pagination-label">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="secondary" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
export default DataTable;
