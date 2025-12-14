import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAuthor } from '../../../model';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { BookService } from '../../book.service';
import { DialogService } from '../../../../../components/dialog';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-author-detail',
    templateUrl: './author-detail.component.html',
    styleUrls: ['./author-detail.component.scss']
})
export class AuthorDetailComponent implements OnInit {
    private readonly service = inject(BookService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private uploadService = inject(FileUploadService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        avatar: '',
        description: '',
    });
    public dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
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
        history.back();
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IAuthor = this.dataForm().value() as any;
        this.service.authorSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
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
