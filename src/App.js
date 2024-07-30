import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout.js';
import Main from './routes/Main';
import Signup from './routes/Signup.js';
import Board from "./routes/Board";
import CreateBoard from "./routes/CreateBoard";

export const baseUrl = 'http://localhost:8080';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Main />,
            },
            {
                path: '/signup',
                element: <Signup />,
            },
            {
                path: '/boards',
                element: <Board />,
            },
            {
                path: '/boards/create',
                element: <CreateBoard />,
            },
        ],
    },
]);

function App() {
    return (
        <div>
            <RouterProvider router={router}></RouterProvider>
        </div>
    );
}

export default App;
