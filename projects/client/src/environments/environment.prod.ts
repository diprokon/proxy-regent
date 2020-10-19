const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')

export const environment = {
    production: true,
    wsUrl: `${socketProtocol}//${window.location.hostname}:${window.location.port}/api/`
};
