import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../components/dialog';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-example-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ExampleModalComponent {
    private readonly toastrService = inject(DialogService);


    public readonly customModal = form(signal({
        visible: false,
        page: 0,
        multipleEditable: false
    }));

    public tapTip(kind = 0) {
        switch (kind) {
            case 1:
                this.toastrService.warning('消息');
                break;
            case 2:
                this.toastrService.error('消息');
                break;
            case 3:
                this.toastrService.success('消息');
                break;
            default:
                this.toastrService.tip('消息');
                break;
        }
    }

    public toggleMultiple() {
        this.customModal.multipleEditable().value.update(v => !v);
    }

    public tapLoading() {
        this.toastrService.loading();
    }

    public tapConfirm() {
        this.toastrService.confirm('消息', () => {

        });
    }
}
