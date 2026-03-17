import { createBrowserRouter } from "react-router-dom"
import Main from "./pages/Main"


const routes = createBrowserRouter([
    {
        path: '/',
        Component: Main
    }
])

export default routes