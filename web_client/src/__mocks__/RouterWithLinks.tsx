import { MemoryRouter, Route, Routes, Outlet } from 'react-router-dom'

interface RouterWithLinksProps {
  children: JSX.Element
  otherLinks?: Array<{
    path: string
    component: JSX.Element
  }>
  context?: { userIsAuthenticated: boolean }
  initialEntries?: string[]
  componentsPath?: string
}

export const RouterWithLinks = ({
  children,
  otherLinks=[],
  context={userIsAuthenticated: true},
  initialEntries=[],
  componentsPath,
}: RouterWithLinksProps) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<Outlet context={context} />}>
            {componentsPath != null ? <Route path={componentsPath} element={children} /> : <Route index element={children} /> }
          </Route>
          {otherLinks.map(({ path, component }) => (
              <Route key={path} path={path} element={<>{component}</>}/>
          ))}
        </Routes>
    </MemoryRouter>
  )
}
