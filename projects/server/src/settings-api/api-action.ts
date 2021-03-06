import { WsRequests } from '@prm/shared';

const actionMapProp = Symbol('actionMapProp');

export function Action(action: WsRequests) {
    return (
        target: any,
        propertyKey: string
    ) => {
        const actionMap = target[actionMapProp] = target[actionMapProp] ? target[actionMapProp] : {};
        actionMap[action] = propertyKey;
    }
}

export function getApiAction<T>(target: T, action): string {
    const actionMap = target[actionMapProp] || {};

    return actionMap[action] || null;
}
