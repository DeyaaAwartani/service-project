export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'notifications_db',
  },

  notifications: {
    fromEmail: process.env.FROM_EMAIL || 'deyaawork54@gmail.com',
    fromPhoneNumber: process.env.FROM_PHONE_NUMBER || '0782933735',
  },

});
