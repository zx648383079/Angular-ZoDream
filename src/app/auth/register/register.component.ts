import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordValidator, confirmValidator } from 'src/app/theme/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public isObserve = false;

  public registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordValidator]],
    confirm_password: ['', [Validators.required]],
    agree: [false, Validators.requiredTrue]
  }, {
    validators: confirmValidator()
  });

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  public tapSignUp() {
  }

}
