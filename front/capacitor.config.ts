import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.timschupp.timsstack',
  appName: 'front',
  webDir: 'out',
  server: {
    //androidScheme: 'https',
    hostname: "10.0.2.2:8000",
    allowNavigation: []
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    CapacitorCookies: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true
  },
  //url: 'http://10.0.2.2:8000',
  bundledWebRuntime: false
};

export default config;
