import './settings-api/server';
import { ProxyMockServer } from './proxy-mock';
import { SettingsApiServer } from './settings-api';

const proxyMockServer = new ProxyMockServer();
proxyMockServer.start()

const apiServer = new SettingsApiServer();
apiServer.start();



