import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IErrorResponse, IErrorResult } from '../../../../../theme/models/page';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { IMusic } from '../../../model';
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
        duration: [0],
    });

    public data: IMusic;

    private audioElement: HTMLAudioElement;

    constructor(
        private fb: FormBuilder,
        private service: VideoService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
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
                this.form.patchValue({
                    name: res.name,
                    singer: res.singer,
                    path: res.path,
                    duration: res.duration,
                });
            });
        });
    }

    get audio(): HTMLAudioElement {
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
        }
        return this.audioElement;
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
        this.service.musicSave(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public uploadFile(event: any, name: string = 'path') {
        const files = event.target.files as FileList;
        this.uploadService.uploadAudio(files[0]).subscribe({
            next: res => {
                this.form.get(name).setValue(res.url);
                this.loadDuration(res);
                this.loadName(res);
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }

    private loadName(res: any) {
        const name = this.form.get('name');
        if (name.valid) {
            return;
        }
        name.setValue(res.original);
    }

    private loadDuration(res: any) {
        this.audio.src = res.url;
        this.audio.load();
        this.audio.oncanplay = () => {
            if (!this.audio.duration) {
                return;
            }
            this.form.get('duration').setValue(Math.floor(this.audio.duration));
        };
    }

}
