import { useOutletContext } from "react-router-dom";

export const useUserIsAuthenticated = () => {
    return useOutletContext<{userIsAuthenticated: boolean}>()
}

export const getUserIsAuthenticatedObj = (userIsAuthenticated: boolean) => {
    return { userIsAuthenticated }
}
