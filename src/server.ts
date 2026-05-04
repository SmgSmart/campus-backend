import app from './app';

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Campaus Backend is LIVE on port ${PORT}`);
    console.log(`📡 URL: http://0.0.0.0:${PORT}`);
});
