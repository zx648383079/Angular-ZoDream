import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IErrorResponse, IErrorResult } from '../../../../../theme/models/page';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { IMusic } from '../../../model';
import { VideoService } from '../../video.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-music',
    templateUrl: './edit-music.component.html',
    styleUrls: ['./edit-music.component.scss']
})
export class EditMusicComponent implements OnInit {
    private readonly service = inject(VideoService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        singer: '',
        path: '',
        duration: 0,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.path);
    });

    private audioElement: HTMLAudioElement;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
              return;
            }
            this.service.music(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    singer: res.singer,
                    path: res.path,
                    duration: res.duration,
                });
            });
        });
    }

    private get audio(): HTMLAudioElement {
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
        }
        return this.audioElement;
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
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
                this.dataForm[name]().value.set(res.url);
                this.loadDuration(res);
                this.loadName(res);
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }

    private loadName(res: any) {
        const name = this.dataForm.name();
        if (name.valid()) {
            return;
        }
        name.value.set(res.original);
    }

    private loadDuration(res: any) {
        this.audio.src = res.url;
        this.audio.load();
        this.audio.oncanplay = () => {
            if (!this.audio.duration) {
                return;
            }
            this.dataForm.duration().value.set(Math.floor(this.audio.duration));
        };
    }

}
