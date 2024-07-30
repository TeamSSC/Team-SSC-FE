import create from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            isLoggedIn: false,
            username: '',
            setIsLoggedIn: (value) => set({ isLoggedIn: value }),
            setUsername: (value) => set({ username: value }),
        }),
        {
            name: 'userLoginStatus',
            getStorage: () => localStorage,
        }
    )
);

export default useAuthStore;
