import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout.js';
import Main from './routes/Main';
import Signup from './routes/Signup.js';
import Period from './routes/Period.js';

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
                path: '/periods',
                element: <Period />,
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
