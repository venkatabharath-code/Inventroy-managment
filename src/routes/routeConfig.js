import { lazy } from 'react';
const InventoryDashboard = lazy(() => import('../pages/inventory/Dashboard/Dashboard'));
const StockManagement = lazy(() => import('../pages/inventory/StockManagement/StockManagement'));
const ProcurementDashboard = lazy(() => import('../pages/procurement/Dashboard/Dashboard'));
const PurchaseOrders = lazy(() => import('../pages/procurement/PurchaseOrders/PurchaseOrders'));
const AssetDashboard = lazy(() => import('../pages/assets/Dashboard/Dashboard'));
const RegisterAsset = lazy(() => import('../pages/assets/RegisterAsset/RegisterAsset'));
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
      { path: 'dashboard', component: ProcurementDashboard },
      { path: 'orders', component: PurchaseOrders },
    ]
  },
  {
    path: '/assets',
    children: [
      { path: 'dashboard', component: AssetDashboard },
      { path: 'register', component: RegisterAsset },
    ]
  }
];
