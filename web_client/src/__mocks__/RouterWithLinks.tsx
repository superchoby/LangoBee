import { MemoryRouter, Route, Routes, Outlet } from 'react-router-dom'

interface RouterWithLinksProps {
  children: JSX.Element
  otherLinks?: Array<{
    path: string
    component: JSX.Element
  }>
  context?: { userIsAuthenticated: boolean }
}

export const RouterWithLinks = ({
  children,
  otherLinks=[],
  context={userIsAuthenticated: true}
}: RouterWithLinksProps) => {
  return (
    <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={context} />}>
            <Route index element={children} />
          </Route>
          {otherLinks.map(({ path, component }) => (
              <Route key={path} path={path} element={<>{component}</>}/>
          ))}
        </Routes>
    </MemoryRouter>
  )
}
