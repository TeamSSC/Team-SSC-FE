import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout.js';
import Main from './routes/Main';
import Signup from './routes/Signup.js';
import Board from './routes/Board';
import CreateBoard from './routes/CreateBoard';
import BoardDetail from './routes/BoardDetail';
import Track from './routes/Track.js';
import PeriodDetail from './routes/PeriodDetail.js';
import Period from './routes/ManagerPage.js';
import MemberCards from './routes/MemberCards.js';

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
            {
                path: '/boards',
                element: <Board />,
            },
            {
                path: '/boards/create',
                element: <CreateBoard />,
            },
            {
                path: '/boards/:id', // BoardDetail로 라우팅 추가
                element: <BoardDetail />,
            },
            {
                path: '/track',
                element: <Track />,
            },
            {
                path: '/period/:periodId',
                element: <PeriodDetail />,
            },
            {
                path: '/period/:periodId/memberCards',
                element: <MemberCards />,
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
