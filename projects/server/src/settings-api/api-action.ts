const actionMapProp = Symbol('actionMapProp');

export function Action(action: string) {
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
