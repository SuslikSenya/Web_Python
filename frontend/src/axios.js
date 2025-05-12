import axios from 'axios';

// Создаём экземпляр axios
const api = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true,
});

// Функция получения куки по имени
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Перехватчик запроса — добавляем CSRF-токен ко всем запросам, кроме GET/OPTIONS/HEAD
api.interceptors.request.use(
    (config) => {
        const csrfToken = getCookie('csrftoken');
        const method = config.method && config.method.toUpperCase();
        const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

        if (!safeMethods.includes(method) && csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;