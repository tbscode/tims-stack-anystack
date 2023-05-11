import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.timschupp.timsstack',
  appName: 'front',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  bundledWebRuntime: false
};

export default config;
