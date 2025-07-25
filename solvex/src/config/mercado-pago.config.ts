import { configDotenv } from 'dotenv';
configDotenv({ path: '.env.development' });

export default () => ({
  mercadoPago: {
    accessToken: process.env.MP_ACCESS_TOKEN,
    webHookUrl: process.env.MP_WEBHOOK_URL,
  },
});
