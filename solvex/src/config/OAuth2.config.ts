import { configDotenv } from 'dotenv';

configDotenv({ path: '.env.development' });

export default () => ({
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
});
