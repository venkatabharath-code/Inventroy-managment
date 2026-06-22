import Card from '../../common/Card/Card';
import DataTable from '../../common/DataTable/DataTable';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import './RecentMovements.css';
const columns = [
  { field: 'dateTime', header: 'Date/Time', width: '15%' },
  { field: 'item', header: 'Item', width: '25%' },
  {
    field: 'type',
    header: 'Type',
    width: '10%',
    render: (val) => <StatusBadge status={val} />
  },
  {
    field: 'quantity',
    header: 'Quantity',
    width: '15%',
    render: (val, row) => (
      <span className={`qty-${row.quantityType || 'neutral'}`}>
        {val}
      </span>
    )
  },
  { field: 'location', header: 'Location', width: '20%' },
  { field: 'user', header: 'User', width: '15%' }
];
const RecentMovements = ({ data }) => {
  return (
    <Card className="recent-movements-card" title="Recent Stock Movements" noPadding>
      <div className="recent-movements-table-wrapper">
        <DataTable columns={columns} data={data} keyField="id" />
      </div>
    </Card>
  );
};
export default RecentMovements;
