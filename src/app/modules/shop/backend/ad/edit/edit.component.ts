import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    ActivatedRoute
} from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import {
    IAd,
    IAdPosition
} from '../../../model';
import {
    FileUploadService
} from '../../../../../theme/services/file-upload.service';
import {
    AdService
} from '../../ad.service';
import { parseNumber } from '../../../../../theme/utils';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditAdComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        position_id: [0],
        type: [0],
        url: [''],
        content: [''],
        start_at: [''],
        end_at: [''],
    });

    public data: IAd;
    public positionItems: IAdPosition[] = [];

    constructor(
        private service: AdService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) {
        this.service.positionAll().subscribe(res => {
            this.positionItems = res.data;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.ad(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    position_id: res.position_id,
                    type: res.type,
                    url: res.url,
                    content: res.content,
                    start_at: res.start_at,
                    end_at: res.start_at,
                });
            });
        });
    }

    get typeInput() {
        return this.form.get('type');
    }

    get uploadType() {
        const val = parseNumber(this.typeInput.value);
        if (val < 1 || val === 2) {
            return 0;
        }
        if (val < 2) {
            return 1;
        }
        return 2;
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IAd = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.adSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.form.get('content').setValue(res.url);
        });
    }

    public tapPreview(name: string) {
        window.open(this.form.get(name).value, '_blank');
    }

    public uploadVideo(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadVideo(files[0]).subscribe(res => {
            this.form.get('content').setValue(res.url);
        });
    }

}
