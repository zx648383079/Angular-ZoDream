import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { CountdownEvent } from '../../../../../components/form';
import { IUser } from '../../../../../theme/models/user';
import { emailValidate, emptyValidate, mobileValidate } from '../../../../../theme/validators';
import { ShopService } from '../../../shop.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bind-step',
    templateUrl: './bind-step.component.html',
    styleUrls: ['./bind-step.component.scss']
})
export class BindStepComponent {
    private readonly toastrService = inject(DialogService);
    private readonly service = inject(ShopService);


    public readonly name = input('email');
    public readonly user = input<IUser>();

    public verify_value = '';
    public readonly stepIndex = signal(0);
    public readonly dataForm = form(signal({
        name: '',
        verify_type: '',
        verify: '',
        value: '',
        code: '',
    }));

    constructor() {
        effect(() => {
            const name = this.name();
            const user = this.user();
            untracked(() => {
                this.dataForm().value.update(v => {
                    v.verify_type = v.name = name;
                    return v;
                });
                this.verify_value = user[name];
                if (!this.verify_value) {
                    this.tapToggleVerify();
                }
                if (!this.verify_value) {
                    this.stepIndex.set(1);
                }
            });
            
        });
    }

    public readonly nameLabel = computed(() => {
        return this.formatLabel(this.name());
    });

    public readonly verifyLabel = computed(() => {
        const label = this.formatLabel(this.dataForm.verify_type().value())
        return $localize `Old ${label}`;
    })

    private formatLabel(name: string) {
        const maps = {
            email: $localize `Email`,
            mobile: $localize `Phone`
        };
        return Object.prototype.hasOwnProperty.call(maps, name) ? maps[name] : '--';
    }

    public tapToggleVerify() {
        this.dataForm().value.update(v => {
            const type = v.verify_type == 'email' ? 'mobile' : 'email';
            const user = this.user();
            if (user[type]) {
                v.verify_type = type;
                v.verify = '';
                this.verify_value = user[type];
            }
            return v;
        });
        
    }

    public tapSendCode(e: CountdownEvent) {
        if (this.stepIndex() < 1) {
            // 直接获取验证码
            this.service.sendCode({
                to_type: this.dataForm.verify_type().value() as any,
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
            to_type: this.dataForm.name().value() as any,
            to: this.dataForm.value().value(),
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
        if (this.stepIndex() < 1) {
            this.verifyRole();
            return;
        }
        if (this.stepIndex() == 1) {
            this.verifyData();
        }
    }

    private verifyValue(): boolean {
        const value = this.dataForm.value().value();
        if (emptyValidate(value)) {
            this.toastrService.warning($localize `Please input ${this.nameLabel}`);
            return false;
        }
        const name = this.name();
        if (
            (name === 'email' && !emailValidate(value)) ||
            (name === 'mobile' && !mobileValidate(value))
        ) {
            this.toastrService.warning($localize `Please input valid ${this.nameLabel}`);
            return false;
        }
        return true;
    }

    private verifyData() {
        if (!this.verifyValue()) {
            return;
        }
        if (emptyValidate(this.dataForm.code().value())) {
            this.toastrService.warning($localize `Please enter the verification code`);
            return;
        }
        // 提交数据进行更改
        this.service.updateAccount(this.dataForm().value()).subscribe({
            next: _ => {
                this.stepIndex.set(2);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    private verifyRole() {
        if (emptyValidate(this.dataForm.verify().value())) {
            this.toastrService.warning($localize `Please enter the verification code`);
            return;
        }
        this.service.verifyCode({
            to_type: this.dataForm.verify_type().value() as any,
            code: this.dataForm.verify().value(),
            event: 'verify_old',
        }).subscribe({
            next: _ => {
                this.stepIndex.set(1);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
