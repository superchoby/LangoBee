// RenderRouteWithOutletContext.tsx
import { ReactNode } from 'react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';

interface RenderRouteWithOutletContextProps {
  context: { userIsAuthenticated: boolean };
  children: ReactNode;
}

export const RenderRouteWithOutletContext = ({
  context,
  children,
}: RenderRouteWithOutletContextProps) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/"element={<Outlet context={context} />}>
          <Route index element={children} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};
