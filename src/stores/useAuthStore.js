import create from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            username: '',
            setIsLoggedIn: (value) => {
                console.log('Setting isLoggedIn:', value);
                set({ isLoggedIn: value });
            },
            setUsername: (value) => {
                console.log('Setting username:', value);
                set({ username: value });
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
