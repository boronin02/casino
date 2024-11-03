export function signUp(registration) {
    return fetch('http://localhost:8000/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: registration.name,
            login: registration.login,
            password: registration.password,
        }),
    }).then(response => response.json());
}

export function signIn(login) {
    return fetch('http://localhost:8000/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            login: login.login,
            password: login.password,
        }),
    }).then(response => response.json());
}
