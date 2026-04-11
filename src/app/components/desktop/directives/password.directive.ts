import {
    Directive
} from '@angular/core';
import {
    ValidatorFn,
    AbstractControl,
    ValidationErrors,
    NG_VALIDATORS,
    Validator,
    FormGroup
} from '@angular/forms';
import { mobileValidate, passwordValidate } from '../../../theme/validators';

@Directive({
    standalone: false,
    selector: '[appPassword]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: PasswordValidatorDirective,
        multi: false
    }]
})
export class PasswordValidatorDirective implements Validator {

    validate(control: AbstractControl) {
        return passwordValidator(control);
    }

}

export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return control.value && !passwordValidate(control.value) ? {
        password: true
    } : null;
};

export const mobileValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return control.value && !mobileValidate(control.value) ? {
        mobile: true
    } : null;
};

export const confirmValidator = (key: string = 'password', confirmKey: string = 'confirm_password'): ValidationErrors | null => {
    return (control: FormGroup): ValidationErrors | null => {
        return control.get(key)!.value !== control.get(confirmKey)!.value ? {
            confirm: true
        } : null;
    };
};
