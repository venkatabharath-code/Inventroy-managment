import { lazy } from 'react';

// Inventory Module
const InventoryDashboard = lazy(() => import('../pages/inventory/Dashboard/Dashboard'));
const StockManagement = lazy(() => import('../pages/inventory/StockManagement/StockManagement'));

// Procurement Module
const ProcurementDashboard = lazy(() => import('../pages/procurement/Dashboard/Dashboard'));
const PurchaseOrders = lazy(() => import('../pages/procurement/PurchaseOrders/PurchaseOrders'));

// Asset Module
const AssetDashboard = lazy(() => import('../pages/assets/Dashboard/Dashboard'));
const RegisterAsset = lazy(() => import('../pages/assets/RegisterAsset/RegisterAsset'));



export const routes = [
  {
    path: '/',
    // Redirect to inventory dashboard as default
    redirectTo: '/inventory/dashboard'
  },
  {
    path: '/inventory',
    children: [
      { path: 'dashboard', component: InventoryDashboard },
      { path: 'stock', component: StockManagement },
      // Other inventory routes can be added here
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
