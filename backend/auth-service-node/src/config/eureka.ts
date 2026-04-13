// @ts-ignore
import { Eureka } from 'eureka-js-client';

const client = new Eureka({
  instance: {
    app: 'auth-service',
    hostName: process.env.HOSTNAME || 'auth-service-node',
    ipAddr: process.env.HOSTNAME || 'auth-service-node',
    port: {
      '$': parseInt(process.env.PORT || '3001'),
      '@enabled': true,
    },
    vipAddress: 'auth-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: process.env.EUREKA_HOST || 'localhost',
    port: parseInt(process.env.EUREKA_PORT || '8761'),
    servicePath: '/eureka/apps/',
  },
});

export const registerWithEureka = () => {
  client.start((error: Error | null) => {
    if (error) {
      console.error('Eureka registration failed:', error);
    } else {
      console.log('Registered with Eureka');
    }
  });
};

export default client;
