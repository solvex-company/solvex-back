import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config({ path: 'env.development' });

export const cloudinaryConfig = {
  provide: 'Cloudinary',
  useFactory: () => {
    {
      cloudinary.config({
        CLOUD_NAME: process.env.CLOUD_NAME,
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET,
      });
    }
  },
};
