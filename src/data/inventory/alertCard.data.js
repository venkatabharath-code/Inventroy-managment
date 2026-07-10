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
