import { Component, DestroyRef, inject } from '@angular/core';
import { DialogLoadingOption } from '..';
import { DialogPackage } from '../dialog.injector';
import { DialogService } from '../dialog.service';

@Component({
    standalone: false,
    selector: 'app-dialog-loading',
    templateUrl: './dialog-loading.component.html',
    styleUrls: ['./dialog-loading.component.scss']
})
export class DialogLoadingComponent {
    private readonly data = inject<DialogPackage<DialogLoadingOption>>(DialogPackage);
    private readonly service = inject(DialogService);
    private readonly destroyRef = inject(DestroyRef);


    public title = '';
    public closeable = true;

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
        const timeHandle = setTimeout(() => {
            this.service.remove(this.data.dialogId);
        }, option.time);
        this.destroyRef.onDestroy(() => {
            clearTimeout(timeHandle);
        });
    }

    public close() {
        if (!this.closeable) {
            return;
        }
        this.service.remove(this.data.dialogId);
    }
}
