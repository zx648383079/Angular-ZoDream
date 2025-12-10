import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IUser } from '../../../../../theme/models/user';
import { AuthService } from '../../auth.service';
import { ButtonEvent } from '../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-change-account',
    templateUrl: './change-account.component.html',
    styleUrls: ['./change-account.component.scss']
})
export class ChangeAccountComponent implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(AuthService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public form = this.fb.group({
        type: [0, Validators.required],
        money: [0, Validators.required],
        remark: [''],
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
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.user_id = this.data.id;
        }
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
