import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IAuthor } from '../../../model';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { BookService } from '../../book.service';
import { DialogService } from '../../../../../components/dialog';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.scss']
})
export class AuthorDetailComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        avatar: [''],
        description: [''],
    });

    public data: IAuthor;

    constructor(
        private fb: FormBuilder,
        private service: BookService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.author(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
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
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IAuthor = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.authorSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.form.get('avatar').setValue(res.url);
        });
    }

    public tapPreview() {
        window.open(this.form.get('avatar').value, '_blank');
    }

}
