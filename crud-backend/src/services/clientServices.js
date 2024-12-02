import { query } from "../db.js";

export const getClients = async () => {
    try {
        const { rows } = await query(
            `SELECT ROW_NUMBER() OVER (ORDER BY id ASC) AS row_number, * 
             FROM clients_tb 
             ORDER BY id ASC;`
        );
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Database query failed');
    }
};


export const createClient = async (clientData) => {
    const { name, email, job, rate, isactive } = clientData;

    try {
        const { rows } = await query(
            `INSERT INTO clients_tb (name, email, job, rate, isactive)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, job, rate, isactive]
        );

        return rows[0]; // Return the inserted row
    } catch (err) {
        console.error('Error executing query:', err);  // Log error from DB query
        throw new Error('Error inserting new client');
    }
};

export const updateClient = async (clientData, clientId) => {
    const { name, email, job, rate, isactive } = clientData;

    const { rows } = await query(
        `UPDATE clients_tb SET name = $1, email = $2, job = $3, rate = $4, isactive = $5
        WHERE id = $6 RETURNING *`,
        [name, email, job, rate, isactive, clientId]
        );
    
    return rows[0]; // Return the inserted row
};

export const deleteClient = async (clientId) => {
    try {
        const { rowCount } = await query(
            `DELETE FROM clients_tb WHERE id = $1`, [clientId]
        );

        return rowCount > 0; // Return true if a row was deleted, false otherwise
    } catch (err) {
        console.error('Error deleting client:', err);
        throw new Error('Error deleting client');
    }
};

export const searchClients = async (searchTerms) => {
    const { rows } = await query(
        `SELECT * FROM clients_tb
        WHERE name ILIKE $1 OR email ILIKE $1 OR
        job ILIKE $1 OR CAST(rate AS TEXT) ILIKE $1
        OR isactive::TEXT ILIKE $1`,  // Use CAST for rate, use boolean comparison for isactive
        [`%${searchTerms}%`]
    );
    return rows;
};

