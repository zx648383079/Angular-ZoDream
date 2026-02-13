import { Component, inject, signal } from '@angular/core';
import { DialogBaseEvent, DialogService } from '../../../components/dialog';
import { form, pattern, required } from '@angular/forms/signals';
import { NavigationService } from '../navigation.service';
import { FileUploadService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-navigation-page-card',
    templateUrl: './page-card.component.html',
    styleUrls: ['./page-card.component.scss'],
})
export class PageCardComponent implements DialogBaseEvent {

    private readonly service = inject(NavigationService);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);
    /**
     * 是否显示
     */
    public readonly visible = signal(false);
    public readonly isLoading = signal(false);

    public readonly dataForm = form(signal({
        title: '',
        description: '',
        thumb: '',
        link: '',
    }), schemaPath => {
        required(schemaPath.link);
        required(schemaPath.title);
        pattern(schemaPath.link, /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, {
            message: $localize `Link is invalid!`
        });
    });

    public open() {
        this.visible.set(true);
    }

    public close() {
        this.visible.set(false);
    }

    public tapReset() {
        this.dataForm().value.set({
            thumb: '',
            link: '',
            title: '',
            description: ''
        });
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            return;
        }
        this.isLoading.set(true);
        this.service.submit({...this.dataForm().value()}).subscribe({
            next: _ => {
                this.toastrService.success($localize `Submitted, waiting for review`);
                this.isLoading.set(false);
                this.close();
            },
            error: err => {
                this.isLoading.set(false);
                this.toastrService.error(err);
            }
        })
    }



    public uploadFile(e: any) {
        if (this.isLoading()) {
            return;
        }
        const files = e.target.files as FileList;
        if (files.length < 1) {
            return;
        }
        this.uploadService.preview(files[0]).subscribe(res => {
            this.dataForm.thumb().value.set(res);
        });
    }
}
