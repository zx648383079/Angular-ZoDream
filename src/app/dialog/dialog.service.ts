import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmOption, DialogTipOption } from './model';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(
        private toastrService: ToastrService,
    ) { }


    public error(message: string) {
        this.toastrService.error(message);
    }

    public warning(message: string) {
        this.toastrService.warning(message);
    }

    public success(message: string) {
        this.toastrService.success(message);
    }

    public tip(content: string): void;
    public tip(content: string, time: number): void;
    public tip(option: DialogTipOption): void;
    public tip(option: string|DialogTipOption, time = 2000) {
        const opt = typeof option === 'object' ? option : {
            content: option,
            time,
        };
        this.toastrService.show(opt.content);
    }

    public confirm(content: string, onConfirm: () => void): void;
    public confirm(option: DialogConfirmOption): void;
    public confirm(option: DialogConfirmOption|string, onConfirm?: () => void) {
        const opt = typeof option === 'object' ? option : {
            title: option,
            onConfirm,
        };
        if (confirm(opt.title||opt.content)) {
            opt.onConfirm && opt.onConfirm();
            return;
        }
        opt.onCancel && opt.onCancel();
    }
}
