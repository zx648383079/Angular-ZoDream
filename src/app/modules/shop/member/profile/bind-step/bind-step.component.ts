import { Component, OnChanges, SimpleChanges, inject, input } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { CountdownEvent } from '../../../../../components/form';
import { IUser } from '../../../../../theme/models/user';
import { emailValidate, emptyValidate, mobileValidate } from '../../../../../theme/validators';
import { ShopService } from '../../../shop.service';

@Component({
    standalone: false,
  selector: 'app-bind-step',
  templateUrl: './bind-step.component.html',
  styleUrls: ['./bind-step.component.scss']
})
export class BindStepComponent implements OnChanges {
    private toastrService = inject(DialogService);
    private service = inject(ShopService);


    public readonly name = input('email');
    public readonly user = input<IUser>(undefined);

    public verify_value = '';
    public stepIndex = 0;
    public data = {
        name: '',
        verify_type: '',
        verify: '',
        value: '',
        code: '',
    };

    public get nameLabel() {
        return this.formatLabel(this.name());
    }

    public get verifyLabel() {
        return '原' + this.formatLabel(this.data.verify_type);
    }

    private formatLabel(name: string) {
        const maps = {
            email: '邮箱',
            mobile: '手机号'
        };
        return Object.prototype.hasOwnProperty.call(maps, name) ? maps[name] : '--';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.name) {
            this.data.verify_type = this.data.name = this.name();
            this.verify_value = this.user()[this.data.verify_type];
            if (!this.verify_value) {
                this.tapToggleVerify();
            }
            if (!this.verify_value) {
                this.stepIndex = 1;
            }
        }
    }

    public tapToggleVerify() {
        const type = this.data.verify_type == 'email' ? 'mobile' : 'email';
        const user = this.user();
        if (user[type]) {
            this.data.verify_type = type;
            this.data.verify = '';
            this.verify_value = user[type];
        }
    }

    public tapSendCode(e: CountdownEvent) {
        if (this.stepIndex < 1) {
            // 直接获取验证码
            this.service.sendCode({
                to_type: this.data.verify_type as any,
                event: 'verify_old',
            }).subscribe({
                next: _ => {
                    e.start();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
            return;
        }
        if (!this.verifyValue()) {
            return;
        }
        // 获取新的验证码
        this.service.sendCode({
            to_type: this.data.name as any,
            to: this.data.value,
            event: 'verify_new',
        }).subscribe({
            next: _ => {
                e.start();
            },
            error: err => {
                this.toastrService.error(err);
            }
        })
    }

    public tapNext() {
        if (this.stepIndex < 1) {
            this.verifyRole();
            return;
        }
        if (this.stepIndex == 1) {
            this.verifyData();
        }
    }

    private verifyValue(): boolean {
        if (emptyValidate(this.data.value)) {
            this.toastrService.warning('请输入' + this.nameLabel);
            return false;
        }
        const name = this.name();
        if (
            (name === 'email' && !emailValidate(this.data.value)) ||
            (name === 'mobile' && !mobileValidate(this.data.value))
        ) {
            this.toastrService.warning('请输入正确的' + this.nameLabel);
            return false;
        }
        return true;
    }

    private verifyData() {
        if (!this.verifyValue()) {
            return;
        }
        if (emptyValidate(this.data.code)) {
            this.toastrService.warning('请输入验证码');
            return;
        }
        // 提交数据进行更改
        this.service.updateAccount(this.data).subscribe({
            next: _ => {
                this.stepIndex = 2;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    private verifyRole() {
        if (emptyValidate(this.data.verify)) {
            this.toastrService.warning('请输入验证码');
            return;
        }
        this.service.verifyCode({
            to_type: this.data.verify_type as any,
            code: this.data.verify,
            event: 'verify_old',
        }).subscribe({
            next: _ => {
                this.stepIndex = 1;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
