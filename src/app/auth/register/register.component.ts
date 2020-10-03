import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { passwordValidator, confirmValidator } from 'src/app/theme/validators';
import { AuthActions } from '../../theme/actions';
import { AppState } from '../../theme/interfaces';
import { AuthService } from '../../theme/services';

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
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private actions: AuthActions,
    private authService: AuthService
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
    if (!this.registerForm.valid) {
      return;
    }
    this.authService
        .register(this.registerForm.value).subscribe(_ => {

        });
  }

}
