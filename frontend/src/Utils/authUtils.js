// apiUtils.js
export async function fetchWithToken(url, options = {}) {
    let accessToken = localStorage.getItem('auth-token');  // Retrieve the current access token
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
    };

    let response = await fetch(url, options);

    if (response.status === 401) {  // If token is expired
        // Try to refresh the token
        let refreshToken = localStorage.getItem('refresh-token');  // Retrieve the refresh token
        let refreshResponse = await fetch('http://localhost:4001/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken })
        });

        if (refreshResponse.ok) {
            let data = await refreshResponse.json();
            localStorage.setItem('auth-token', data.accessToken);  // Save the new access token
            accessToken = data.accessToken;
            
            // Retry the original request with the new token
            options.headers['Authorization'] = `Bearer ${accessToken}`;
            response = await fetch(url, options);
        } else {
            // Handle case where refresh token is also expired
            localStorage.removeItem('auth-token');
            localStorage.removeItem('refresh-token');
            window.location.replace("/login");  // Redirect user to login page
        }
    }

    return response;
}
