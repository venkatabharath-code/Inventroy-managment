import { lazy } from 'react';

const InventoryDashboard = lazy(() => import('../pages/inventory/Dashboard/Dashboard'));
const StockManagement = lazy(() => import('../pages/inventory/StockManagement/StockManagement'));
const ProcurementDashboard = lazy(() => import('../pages/inventory/procurement/Dashboard/Dashboard'));
const AssetDashboard = lazy(() => import('../pages/inventory/assets/Dashboard/Dashboard'));

export const routes = [
  {
    path: '/',
    redirectTo: '/inventory/dashboard'
  },
  {
    path: '/inventory',
    children: [
      { path: 'dashboard', component: InventoryDashboard },
      { path: 'stock', component: StockManagement },
    ]
  },
  {
    path: '/procurement',
    children: [
      { path: 'dashboard', component: ProcurementDashboard }
    ]
  },
  {
    path: '/assets',
    children: [
      { path: 'dashboard', component: AssetDashboard }
    ]
  }
];
