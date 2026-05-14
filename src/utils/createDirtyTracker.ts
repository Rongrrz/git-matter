export function createDirtyTracker<T>(getValue: () => T) {
    let previous = getValue();
    return (): boolean => {
        const current = getValue();
        const isDirty = current !== previous;
        previous = current;
        return isDirty;
    };
}
