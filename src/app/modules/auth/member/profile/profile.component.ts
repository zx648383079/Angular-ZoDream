import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { SexItems, IUser } from '../../../../theme/models/user';
import { parseNumber } from '../../../../theme/utils';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-member-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    public sexItems = SexItems;
    public user: IUser;
    public form = this.fb.group({
        name: ['', Validators.required],
        sex: [0],
        birthday: [''],
    });
    public tabIndex = 0;
    public stepData = {
        name: '',
    };

    constructor(
        private service: MemberService,
        private toastrService: DialogService,
        public route: ActivatedRoute,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.service.profile().subscribe({
            next: user => {
                this.user = user;
                this.form.patchValue({
                    name: user.name,
                    sex: user.sex,
                    birthday: user.birthday,
                });
            }, error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    public tapStepEdit(name = 'email') {
        this.tabIndex = 2;
        this.stepData.name = name;
    }


    public tapSex(item: IItem) {
        this.user.sex = item.value as number;
        this.user.sex_label = item.name;
        this.form.get('sex').setValue(parseNumber(item.value));
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete form filling`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        this.service.updateProfile(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Save Successfully`);
            }, error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.service.uploadAvatar(files[0]).subscribe(res => {
            this.user = res;
            this.toastrService.success($localize `Avatar has been changed`);
        });
    }

}
