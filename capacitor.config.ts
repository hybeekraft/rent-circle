import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rentcircle.app',
  appName: 'RentCircle',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;