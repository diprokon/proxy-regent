const actionMapProp = Symbol('actionMapProp');

export function Action(action: string) {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const actionMap = target[actionMapProp] = target[actionMapProp] ? target[actionMapProp] : {};
        actionMap[action] = propertyKey;
    }
}

export function getApiAction<T>(target: T, action): (data?) => void {
    return target[actionMapProp][action] || (() => {});
}
