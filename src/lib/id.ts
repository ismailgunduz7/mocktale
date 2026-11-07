let counter = 0;

/** Short ids for list keys. They only need to be unique within one open tab. */
export const uid = (): string => `m${Date.now().toString(36)}${(counter++).toString(36)}`;
