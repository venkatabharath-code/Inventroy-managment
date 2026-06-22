import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routeConfig';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';
import Loader from '../components/common/Loader/Loader';
const renderRoutes = (routesArr) => {
  return routesArr.map((route, index) => {
    if (route.redirectTo) {
      return (
        <Route 
          key={index} 
          path={route.path} 
          element={<Navigate to={route.redirectTo} replace />} 
        />
      );
    }
    if (route.children) {
      return (
        <Route key={index} path={route.path}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    const Component = route.component;
    return (
      <Route 
        key={index} 
        path={route.path} 
        element={<Component />} 
      />
    );
  });
};
const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<DashboardLayout />}>
          {renderRoutes(routes)}
        </Route>
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;
