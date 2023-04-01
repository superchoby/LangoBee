import { BrowserRouter, Route, Routes } from 'react-router-dom'

interface RouterWithLinksProps {
    mainComponent: JSX.Element
    otherLinks: {
        path: string,
        component: JSX.Element
    }[]
}

export const RouterWithLinks = ({
    mainComponent,
    otherLinks,
}: RouterWithLinksProps) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<>{mainComponent}</>} />
                {otherLinks.map(({path, component}) => (
                    <Route key={path} path={path} element={<>{component}</>}/>
                ))}
            </Routes>
        </BrowserRouter>
    )
}