export function mobileValidate(mobile: string): boolean {
    return /^1[3456789]\d{9}$/.test(mobile);
}

export function emailValidate(email: string): boolean {
    return /^.+@.+\.\w+$/.test(email);
}

export function passwordValidate(password: string): boolean {
    return password.length > 5;
}

/**
 * 如果为空
 * @param value 
 * @returns 
 */
export function emptyValidate(value: string): boolean {
    return !value || value.trim().length < 1;
}

export function intValidate(val: string): boolean {
    return val && /^\d+$/.test(val);
}

