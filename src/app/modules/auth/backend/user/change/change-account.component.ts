import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IUser } from '../../../../../theme/models/user';
import { AuthService } from '../../auth.service';
import { ButtonEvent } from '../../../../../components/form';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-change-account',
    templateUrl: './change-account.component.html',
    styleUrls: ['./change-account.component.scss']
})
export class ChangeAccountComponent implements OnInit {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        type: '',
        money: 0,
        remark: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.type);
        required(schemaPath.money);
    });

    public data: IUser;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.tapBack();
                return;
            }
            this.service.user(params.id).subscribe(res => {
                this.data = res;
            });
        });
    }

    public tapBack() {
        this.location.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
        e?.enter();
        this.service.rechargeSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('充值成功');
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }
}
