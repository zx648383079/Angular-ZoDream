import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { CountdownEvent } from '../../../../../components/form';
import { IUser } from '../../../../../theme/models/user';
import { emailValidate, emptyValidate, mobileValidate } from '../../../../../theme/validators';

@Component({
  selector: 'app-bind-step',
  templateUrl: './bind-step.component.html',
  styleUrls: ['./bind-step.component.scss']
})
export class BindStepComponent implements OnChanges {

    @Input() public name = 'email';
    @Input() public user: IUser;

    public verify_value = '';
    public stepIndex = 0;
    public data = {
        name: '',
        verify: '',
        verify_code: '',
        value: '',
        code: '',
    };

    constructor(
        private toastrService: DialogService,
    ) { }

    public get nameLabel() {
        return this.formatLabel(this.name);
    }

    public get verifyLabel() {
        return '原' + this.formatLabel(this.data.verify);
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
            this.data.verify = this.data.name = this.name;
            this.verify_value = this.user[this.data.verify];
            if (!this.verify_value) {
                this.tapToggleVerify();
            }
            if (!this.verify_value) {
                this.stepIndex = 1;
            }
        }
    }

    public tapToggleVerify() {
        const verify = this.data.verify == 'email' ? 'mobile' : 'email';
        if (this.user[verify]) {
            this.data.verify = verify;
            this.data.verify_code = '';
            this.verify_value = this.user[verify];
        }
    }

    public tapSendCode(e: CountdownEvent) {
        if (this.stepIndex < 1) {
            // 直接获取验证码
            return;
        }
        if (!this.verifyValue()) {
            return;
        }
        // 获取新的验证码
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
        if (
            (this.name === 'email' && !emailValidate(this.data.value)) ||
            (this.name === 'mobile' && !mobileValidate(this.data.value))
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
    }

    private verifyRole() {
        if (emptyValidate(this.data.verify_code)) {
            this.toastrService.warning('请输入验证码');
            return;
        }
        this.stepIndex = 1;
    }
}
