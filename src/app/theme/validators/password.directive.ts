import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS, Validator, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: false }]
})
export class PasswordValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    return passwordValidator(control);
  }

}

export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return control.value && control.value.length < 6 ? {
    password: true
  } : null;
};

export const mobileValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return control.value && !/^1[3456789]\d{9}$/.test(control.value) ? {
    mobile: true
  } : null;
};

export const confirmValidator = (key: string = 'password', confirmKey: string = 'confirm_password'): ValidatorFn => {
  return (control: FormGroup): ValidationErrors | null => {
    return control.get(key).value !== control.get(confirmKey).value ? {
      confirm : true
    } : null;
  };
};
