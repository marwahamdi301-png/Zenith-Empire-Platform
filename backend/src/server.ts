import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    network: process.env.VITE_STELLAR_NETWORK || 'testnet'
  });
});

// WebSocket للأسعار المباشرة
wss.on('connection', (ws) => {
  console.log('✅ Client connected to WebSocket');
  
  // Send price updates every 3 seconds
  const interval = setInterval(() => {
    const priceUpdate = {
      type: 'PRICE_UPDATE',
      data: {
        timestamp: Date.now(),
        prices: [
          { symbol: 'XLM', price: 0.1234 * (1 + (Math.random() - 0.5) * 0.01) },
          { symbol: 'BTC', price: 42100 * (1 + (Math.random() - 0.5) * 0.01) },
          { symbol: 'ETH', price: 2340 * (1 + (Math.random() - 0.5) * 0.01) },
        ]
      }
    };
    ws.send(JSON.stringify(priceUpdate));
  }, 3000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('❌ Client disconnected');
  });
});

// Routes
import walletRoutes from './routes/wallet.routes.js';
import tradingRoutes from './routes/trading.routes.js';

app.use('/api/wallet', walletRoutes);
app.use('/api/trading', tradingRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket available on ws://localhost:${PORT}`);
});
