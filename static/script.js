let container;
let socket;

const BUTTON_TYPES = {
    DISABLED: {
        className: 'badge-danger',
        label: 'Disabled',
    },
    ENABLED: {
        className: 'badge-info',
        label: 'Enabled',
    },
};

const BADGE_TYPE = (status) => ({
    className: isSuccessStatus(status) ? 'success' : 'danger',
    label: status,
});

const buttonTypeClassNames = Object.values(BUTTON_TYPES).map(type => type.className);

function isSuccessStatus(status) {
    return status < 400;
}

function createItem(res) {
    const el = document.createElement('li');
    const badgeType = BADGE_TYPE(res.status);
    el.className = 'list-group-item d-flex justify-content-between align-items-center';
    el.innerHTML = `
        <span class="badge badge-${badgeType.className}">${badgeType.label}</span>
        <span>${res.key}</span>
        <span class="badge badge-danger removeBtn pointer" data-key="${res.key}">Remove</span>
    `;
    return el;
}

function send(action, data) {
    const value = {action, data};
    socket.send(JSON.stringify(value));
}

function render(keys) {
    container.innerHTML = '';
    keys.forEach(key => container.appendChild(createItem(key)));
}

const allRequestStatusBtn = document.getElementById('allRequestStatusBtn');

function clearButtonTypeClasses(btn) {
    buttonTypeClassNames.forEach(className => btn.classList.contains(className) && btn.classList.remove(className));
}

function setAllStatusButton(isActive) {
    const status = isActive ? BUTTON_TYPES.ENABLED : BUTTON_TYPES.DISABLED;
    clearButtonTypeClasses(allRequestStatusBtn);
    allRequestStatusBtn.classList.add(status.className);
    allRequestStatusBtn.innerHTML = status.label;
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
            case 'state':
                setAllStatusButton(data);
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

    allRequestStatusBtn
        .addEventListener('click', () => {
            const isActive = allRequestStatusBtn.classList.contains(BUTTON_TYPES.ENABLED.className);
            send('toggleState', !isActive);
        });
}


window.addEventListener('load', init);
