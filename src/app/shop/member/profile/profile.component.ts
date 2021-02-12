import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IErrorResponse } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { IUser } from '../../../theme/models/user';
import { DateAdapter } from '../../../theme/services';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    public sexItems: IItem[] = [
        {
            name: '男',
            value: 1,
        },
        {
            name: '女',
            value: 2,
        },
    ];

    public user: IUser;
    public form = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]],
        sex: [0],
        avatar: [''],
        birthday: [this.dateAdapter.fromModel()],
      });

    constructor(
        private service: ShopService,
        private toastrService: ToastrService,
        public route: ActivatedRoute,
        private fb: FormBuilder,
        private dateAdapter: DateAdapter,
    ) { }

    ngOnInit() {
        this.service.profile().subscribe(user => {
            this.user = user;
            this.form.setValue({
                name: user.name,
                email: user.email,
                sex: user.sex,
                avatar: user.avatar,
                birthday: this.dateAdapter.fromModel(user.birthday),
              });
        }, err => {
            const res = err.error as IErrorResponse;
            this.toastrService.warning(res.message);
        });
    }


    public tapSex(item: IItem) {
        this.user.sex = item.value as number;
        this.user.sex_label = item.name;
    }

    public tapSubmit() {
        if (this.form.invalid) {
          this.toastrService.warning('表单填写不完整');
          return;
        }
        const data: any = Object.assign({}, this.form.value);
        data.birthday = this.dateAdapter.toModel(data.birthday);
        // this.service.uploadProfile(data).subscribe(_ => {
        //   this.toastrService.success('保存成功');
        // }, err => {
        //   this.toastrService.warning(err.error.message);
        // });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        // this.service.uploadAvatar(files[0]).subscribe(res => {
        //   this.data = res;
        //   this.form.get('avatar').setValue(res.avatar);
        //   this.toastrService.success('头像已更换');
        // });
      }
}
