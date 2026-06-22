export const inventoryStats = [
  { id: 1, title: 'Total SKUs', value: '7', subtitle: 'Items tracked', icon: 'total', type: 'info' },
  { id: 2, title: 'Low Stock', value: '2', subtitle: 'Requires reorder', icon: 'low', type: 'warning' },
  { id: 3, title: 'Out of Stock', value: '1', subtitle: 'Urgent action needed', icon: 'out', type: 'danger' },
  { id: 4, title: 'Expiring Soon', value: '1', subtitle: 'Within 30 days', icon: 'expiring', type: 'purple' }
];
export const stockAlerts = [
  {
    id: 1,
    title: 'Urgent: Out of Stock',
    items: [
      {
        id: 101,
        name: 'Amoxicillin 250mg',
        category: 'Medicine',
        location: 'Pharmacy - Shelf B1',
        actionType: 'Create PO'
      }
    ],
    type: 'danger'
  },
  {
    id: 2,
    title: 'Low Stock Alerts',
    items: [
      {
        id: 201,
        name: 'Insulin Glargine 100U/ml',
        current: '450 vials',
        min: '500 vials',
        actionType: 'Reorder'
      },
      {
        id: 202,
        name: 'Surgical Gloves (Medium)',
        current: '150 boxes',
        min: '500 boxes',
        actionType: 'Reorder'
      }
    ],
    type: 'warning'
  }
];
export const stockByCategory = [
  { id: 1, name: 'Medicine', count: 3, status: '2 low stock', statusType: 'danger' },
  { id: 2, name: 'Equipment', count: 1, status: 'All stocked', statusType: 'success' },
  { id: 3, name: 'Consumable', count: 2, status: '1 low stock', statusType: 'warning' },
  { id: 4, name: 'Surgical', count: 1, status: 'All stocked', statusType: 'success' },
  { id: 5, name: 'Other', count: 0, status: 'All stocked', statusType: 'success' }
];
export const recentMovements = [
  {
    id: 1,
    dateTime: '2026-01-03 14:20',
    item: 'Paracetamol 500mg',
    type: 'Stock In',
    quantity: '+500 tablets',
    quantityType: 'positive',
    location: 'Pharmacy - Shelf A3',
    user: 'Robert Martinez'
  },
  {
    id: 2,
    dateTime: '2026-01-03 13:45',
    item: 'Surgical Gloves (M)',
    type: 'Stock Out',
    quantity: '-2 boxes',
    quantityType: 'negative',
    location: 'OR-2',
    user: 'Jennifer Thompson'
  },
  {
    id: 3,
    dateTime: '2026-01-03 11:30',
    item: 'IV Fluid - Normal Saline',
    type: 'Transfer',
    quantity: '10 bags',
    quantityType: 'neutral',
    location: 'ICU Ward',
    user: 'System Auto'
  }
];
