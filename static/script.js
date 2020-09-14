let container;
let socket;

function createItem(key) {
    const el = document.createElement('li');
    el.className = 'list-group-item d-flex justify-content-between align-items-center';
    el.innerHTML = `
        ${key}
        <span class="badge badge-danger removeBtn" data-key="${key}">Remove</span>
    `;
    return el;
}

function send(action, data) {
    const value = {action, data};
    socket.send(JSON.stringify(value));
}

function render(keys) {
    container.innerHTML = '';
    keys.forEach(key => {
        container.appendChild(createItem(key));
    });
}

function init() {
    container = document.getElementById('requests');
    const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
    const echoSocketUrl = `${socketProtocol}//${window.location.hostname}:${window.location.port}/api/`;
    socket = new WebSocket(echoSocketUrl);

    socket.onopen = () => {
        send('allKeys');
    }

    socket.onmessage = (event) => {
        const {key, data} = JSON.parse(event.data);
        switch (key) {
            case 'allKeys':
                render(data);
                break;
        }
    }

    container
        .addEventListener('click', (event) => {
            if (!event.target.classList.contains('removeBtn')) {
                return;
            }
            const key = event.target.getAttribute('data-key');
            send('remove', {key});
        });
}


window.addEventListener('load', init);
