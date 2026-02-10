import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { SexItems, IUser } from '../../../../theme/models/user';
import { parseNumber } from '../../../../theme/utils';
import { MemberService } from '../member.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-member-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    private readonly service = inject(MemberService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);

    public sexItems = SexItems;
    public readonly user = signal<IUser>(null);
    public readonly dataModel = signal({
        name: '',
        sex: 0,
        birthday: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });
    public readonly tabIndex = signal(0);
    public stepData = {
        name: '',
    };

    ngOnInit() {
        this.service.profile().subscribe({
            next: user => {
                this.user.set(user);
                this.dataModel.set({
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
        this.location.back();
    }

    public tapStepEdit(name = 'email') {
        this.tabIndex.set(2);
        this.stepData.name = name;
    }


    public tapSex(item: IItem) {
        this.user.update(v => {
            return {...v, sex: item.value, sex_label: item.name};
        });
        this.dataForm.sex().value.set(parseNumber(item.value));
    }

    public tapSubmit(e: Event) {
        e.preventDefault();
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
            this.user.update(v => {
                return {...v, avatar: res.avatar};
            });
            this.toastrService.success($localize `Avatar has been changed`);
        });
    }

}
