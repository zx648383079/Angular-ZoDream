import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IErrorResponse } from '../../../../theme/models/page';
import { FileUploadService } from '../../../../theme/services/file-upload.service';
import { IMusic } from '../../video';
import { VideoService } from '../../video.service';

@Component({
  selector: 'app-edit-music',
  templateUrl: './edit-music.component.html',
  styleUrls: ['./edit-music.component.scss']
})
export class EditMusicComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        singer: [''],
        path: ['', Validators.required],
    });

    public data: IMusic;

    constructor(
        private fb: FormBuilder,
        private service: VideoService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
        private uploadService: FileUploadService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
              return;
            }
            this.service.music(params.id).subscribe(res => {
                this.data = res;
                this.form.setValue({
                    name: res.name,
                    singer: res.singer,
                    path: res.path,
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
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.musicSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        }, err => {
            const res = err.error as IErrorResponse;
            this.toastrService.warning(res.message);
        });
    }

    public uploadFile(event: any, name: string = 'path') {
        const files = event.target.files as FileList;
        this.uploadService.uploadAudio(files[0]).subscribe(res => {
            this.form.get(name).setValue(res.url);
        }, err => {
            const res = err.error as IErrorResponse;
            this.toastrService.warning(res.message);
        });
    }

}
