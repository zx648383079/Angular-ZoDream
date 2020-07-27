import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { AppState } from 'src/app/theme/interfaces';
import { Store } from '@ngrx/store';
import { getCurrentUser } from 'src/app/theme/reducers/selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    sex: [0],
    avatar: [''],
    birthday: [''],
  });

  public sexItems = ['未知', '男', '女'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: AccountService,
    private store: Store<AppState>
  ) {
    this.store.select(getCurrentUser).subscribe(user => {
      this.form.setValue({
        name: user.name,
        email: user.email,
        sex: user.sex,
        avatar: user.avatar,
        birthday: user.birthday,
      });
    });
  }

  ngOnInit() {
  }

  public tapSubmit() {
    console.log(this.form.value);
  }

}
