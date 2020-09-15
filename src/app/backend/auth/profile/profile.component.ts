import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { AppState } from 'src/app/theme/interfaces';
import { Store } from '@ngrx/store';
import { getCurrentUser } from 'src/app/theme/reducers/selectors';
import { IUser } from '../../../theme/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

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

  public data: IUser;

  public sexItems = ['未知', '男', '女'];

  public reasonItems = [
    '需要解绑手机',
    '需要解绑邮箱',
    '安全/隐私顾虑',
    '这是多余的账户',
  ];

  public reasonSelected = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: AccountService,
    private store: Store<AppState>,
    private modalService: NgbModal,
    private toastrService: ToastrService,
  ) {
    this.store.select(getCurrentUser).subscribe(user => {
      this.data = user;
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

  public openCancel(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // TODO 注销
    });
  }

  public quiteUser() {
    this.toastrService.info('您即将退出此账户。。。');
    setTimeout(() => {
      this.router.navigateByUrl('/auth/logout');
    }, 2000);
  }
}
