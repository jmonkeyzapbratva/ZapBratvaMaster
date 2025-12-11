const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

const initDatabase = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                phone_number VARCHAR(20) UNIQUE NOT NULL,
                balance DECIMAL(10, 2) DEFAULT 0.00,
                total_spent DECIMAL(10, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_phone VARCHAR(20) NOT NULL,
                type VARCHAR(20) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS activations (
                id SERIAL PRIMARY KEY,
                user_phone VARCHAR(20) NOT NULL,
                activation_id VARCHAR(50) NOT NULL,
                phone_number VARCHAR(30),
                service VARCHAR(10),
                country INTEGER,
                cost DECIMAL(10, 2),
                status VARCHAR(20) DEFAULT 'pending',
                sms_code VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
            CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_phone);
            CREATE INDEX IF NOT EXISTS idx_activations_user ON activations(user_phone);
            CREATE INDEX IF NOT EXISTS idx_activations_id ON activations(activation_id);
        `);
        console.log('[DB] Tabelas criadas/verificadas com sucesso');
    } catch (error) {
        console.error('[DB] Erro ao criar tabelas:', error.message);
    } finally {
        client.release();
    }
};

const getUser = async (phoneNumber) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE phone_number = $1',
        [phoneNumber]
    );
    return result.rows[0] || null;
};

const createUser = async (phoneNumber) => {
    const result = await pool.query(
        'INSERT INTO users (phone_number) VALUES ($1) ON CONFLICT (phone_number) DO NOTHING RETURNING *',
        [phoneNumber]
    );
    if (result.rows[0]) return result.rows[0];
    return await getUser(phoneNumber);
};

const getBalance = async (phoneNumber) => {
    const user = await getUser(phoneNumber);
    return user ? parseFloat(user.balance) : 0;
};

const addBalance = async (phoneNumber, amount, description = 'Depósito') => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await createUser(phoneNumber);
        
        await client.query(
            'UPDATE users SET balance = balance + $1, updated_at = NOW() WHERE phone_number = $2',
            [amount, phoneNumber]
        );
        
        await client.query(
            'INSERT INTO transactions (user_phone, type, amount, description) VALUES ($1, $2, $3, $4)',
            [phoneNumber, 'credit', amount, description]
        );
        
        await client.query('COMMIT');
        return await getBalance(phoneNumber);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const deductBalance = async (phoneNumber, amount, description = 'Compra de número') => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const user = await getUser(phoneNumber);
        if (!user || parseFloat(user.balance) < amount) {
            throw new Error('Saldo insuficiente');
        }
        
        await client.query(
            'UPDATE users SET balance = balance - $1, total_spent = total_spent + $1, updated_at = NOW() WHERE phone_number = $2',
            [amount, phoneNumber]
        );
        
        await client.query(
            'INSERT INTO transactions (user_phone, type, amount, description) VALUES ($1, $2, $3, $4)',
            [phoneNumber, 'debit', amount, description]
        );
        
        await client.query('COMMIT');
        return await getBalance(phoneNumber);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const refundBalance = async (phoneNumber, amount, description = 'Reembolso') => {
    return await addBalance(phoneNumber, amount, description);
};

const saveActivation = async (userPhone, activationId, phoneNumber, service, country, cost) => {
    const result = await pool.query(
        `INSERT INTO activations (user_phone, activation_id, phone_number, service, country, cost) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userPhone, activationId, phoneNumber, service, country, cost]
    );
    return result.rows[0];
};

const updateActivationStatus = async (activationId, status, smsCode = null) => {
    const result = await pool.query(
        `UPDATE activations SET status = $1, sms_code = $2, updated_at = NOW() 
         WHERE activation_id = $3 RETURNING *`,
        [status, smsCode, activationId]
    );
    return result.rows[0];
};

const getActiveActivations = async (userPhone) => {
    const result = await pool.query(
        `SELECT * FROM activations WHERE user_phone = $1 AND status IN ('pending', 'waiting') 
         ORDER BY created_at DESC`,
        [userPhone]
    );
    return result.rows;
};

const getActivationHistory = async (userPhone, limit = 10) => {
    const result = await pool.query(
        'SELECT * FROM activations WHERE user_phone = $1 ORDER BY created_at DESC LIMIT $2',
        [userPhone, limit]
    );
    return result.rows;
};

const getTransactionHistory = async (userPhone, limit = 10) => {
    const result = await pool.query(
        'SELECT * FROM transactions WHERE user_phone = $1 ORDER BY created_at DESC LIMIT $2',
        [userPhone, limit]
    );
    return result.rows;
};

module.exports = {
    pool,
    initDatabase,
    getUser,
    createUser,
    getBalance,
    addBalance,
    deductBalance,
    refundBalance,
    saveActivation,
    updateActivationStatus,
    getActiveActivations,
    getActivationHistory,
    getTransactionHistory
};
