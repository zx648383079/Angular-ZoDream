import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IAuthor } from '../../../model';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { BookService } from '../../book.service';
import { DialogService } from '../../../../../components/dialog';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-author-detail',
    templateUrl: './author-detail.component.html',
    styleUrls: ['./author-detail.component.scss']
})
export class AuthorDetailComponent {
    private readonly service = inject(BookService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        avatar: '',
        description: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    constructor() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.author(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    avatar: res.avatar,
                    description: res.description,
                });
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
        const data: IAuthor = this.dataForm().value() as any;
        e?.enter();
        this.service.authorSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.dataForm.avatar().value.set(res.url);
        });
    }

    public tapPreview() {
        window.open(this.dataForm.avatar().value(), '_blank');
    }

}
