export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        url: process.env.DATABASE_URL,
    },
    moralis: {
        apiKey: process.env.MORALIS_API_KEY,
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    defaultEmail: 'hyperhire_assignment@hyperhire.in',
});