import { writable } from 'svelte/store';

export const token = writable(
    typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null
);

export const user = writable(
    typeof window !== 'undefined' ? localStorage.getItem('user') : null
);

token.subscribe((value) => {
    if (typeof window !== 'undefined') {
        if (value) localStorage.setItem('jwtToken', value);
        else localStorage.removeItem('jwtToken');
    }
});

user.subscribe((value) => {
    if (typeof window !== 'undefined') {
        if (value) localStorage.setItem('user', value);
        else localStorage.removeItem('user');
    }
});

export const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    token.set(null);
    user.set(null);
};