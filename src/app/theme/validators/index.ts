export * from './password.directive';

export function mobileValidate(mobile: string): boolean {
    return /^1[3456789]\d{9}$/.test(mobile);
}

export function emailValidate(email: string): boolean {
    return /^.+@.+\.\w+$/.test(email);
}

export function passwordValidate(password: string): boolean {
    return password.length > 5;
}
