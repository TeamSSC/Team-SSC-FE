import create from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            username: '',
            periodId: '',
            userPeriodId: '',
            status: '',
            setIsLoggedIn: (value) => {
                console.log('Setting isLoggedIn:', value);
                set({ isLoggedIn: value });
            },
            setUsername: (value) => {
                console.log('Setting username:', value);
                set({ username: value });
            },
            setPeriodId: (value) => {
                console.log('Setting periodId:', value);
                set({ periodId: value });
            },
            setUserPeriodId: (value) => {
                set({ userPeriodId: value });
            },
            setStatus: (value) => {
                console.log('Setting ㅎㅎㅎㅎ:', value);

                set({ status: value });
            },
        }),
        {
            name: 'userLoginStatus',
            // Optional: You can define a custom serialization function if needed
            serialize: (state) => JSON.stringify(state),
            deserialize: (str) => JSON.parse(str),
        }
    )
);

export default useAuthStore;
