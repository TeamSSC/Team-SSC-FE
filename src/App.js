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
import Period from './routes/Period.js';
import MemberCards from './routes/MemberCards.js';
import Profile from './routes/Profile';
import Notice from "./routes/Notice";
import CreateNotice from "./routes/CreateNotice";
import TeamLineUp from "./routes/TeamLineUp";
import TeamProject from "./routes/TeamProject";

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
            {
                path: '/boards/:id', // BoardDetail로 라우팅 추가
                element: <BoardDetail />,
            },
            {
                path: '/admin',
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
            {
                path: '/profile/:userId',
                element: <Profile />,
            },
            {
                path: '/notice',
                element: <Notice />,
            },
            {
                path: '/notice/create',
                element: <CreateNotice />,
            },
            {
                path: '/team/lineup',
                element: <TeamLineUp />,
            },
            {
                path: '/admin/:id',
                element: <Period />,
            },
            {
                path: '/team/project/:weekProgressId/:teamId', // weekProgressId와 teamId를 URL 파라미터로 받도록 변경
                element: <TeamProject />,
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
