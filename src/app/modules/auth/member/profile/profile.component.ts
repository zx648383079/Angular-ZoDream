import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { SexItems, IUser } from '../../../../theme/models/user';
import { parseNumber } from '../../../../theme/utils';
import { MemberService } from '../member.service';

@Component({
    standalone: false,
    selector: 'app-member-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    private readonly service = inject(MemberService);
    private readonly toastrService = inject(DialogService);
    route = inject(ActivatedRoute);


    public sexItems = SexItems;
    public user: IUser;
    public readonly dataModel = signal({
        name: '',
        sex: 0,
        birthday: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });
    public tabIndex = 0;
    public stepData = {
        name: '',
    };

    ngOnInit() {
        this.service.profile().subscribe({
            next: user => {
                this.user = user;
                this.dataModel.set({
                        id: res.id,
                    name: user.name,
                    sex: user.sex,
                    birthday: user.birthday,
                });
            }, error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    public tapBack() {
        history.back();
    }

    public tapStepEdit(name = 'email') {
        this.tabIndex = 2;
        this.stepData.name = name;
    }


    public tapSex(item: IItem) {
        this.user.sex = item.value as number;
        this.user.sex_label = item.name;
        this.dataForm.sex.setValue(parseNumber(item.value));
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete form filling`);
            return;
        }
        const data: any = this.dataForm().value();
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
