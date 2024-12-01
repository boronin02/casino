export const getBalance = async (token) => {
    try {
        const response = await fetch('http://localhost:8000/api/account/balance', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch balance');
        }

        const data = await response.json();
        return data.balance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};
