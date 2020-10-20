import { ProxyMockServer } from './src/proxy-mock';
import { SettingsApiServer } from './src/settings-api';
import { error } from './src/shared';

try {
    const proxyMockServer = new ProxyMockServer();
    proxyMockServer.start()

    const apiServer = new SettingsApiServer();
    apiServer.start();
} catch (e) {
    error(e);
}

