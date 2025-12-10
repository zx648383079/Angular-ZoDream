import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DialogLoadingOption } from '..';
import { DialogPackage } from '../dialog.injector';
import { DialogService } from '../dialog.service';

@Component({
    standalone: false,
  selector: 'app-dialog-loading',
  templateUrl: './dialog-loading.component.html',
  styleUrls: ['./dialog-loading.component.scss']
})
export class DialogLoadingComponent implements OnDestroy {
    private data = inject<DialogPackage<DialogLoadingOption>>(DialogPackage);
    private service = inject(DialogService);


    public title = '';
    public closeable = true;

    private timeHandle: any;

    constructor() {
        const data = this.data;

        const option = data.data;
        this.title = option.title || '';
        if (typeof option.closeable === 'boolean') {
            this.closeable = option.closeable;
        }
        if (typeof option.time !== 'number') {
            option.time = 2000;
        }
        if (option.time < 1) {
            return;
        }
        this.timeHandle = setTimeout(() => {
            this.service.remove(this.data.dialogId);
        }, option.time);
    }

    public close() {
        if (!this.closeable) {
            return;
        }
        this.service.remove(this.data.dialogId);
    }

    ngOnDestroy() {
        if (this.timeHandle) {
            clearTimeout(this.timeHandle);
        }
    }
}
