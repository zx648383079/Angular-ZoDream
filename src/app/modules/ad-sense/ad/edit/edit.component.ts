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
import {
    AdService
} from '../../ad.service';
import { DialogService } from '../../../../components/dialog';
import { FileUploadService } from '../../../../theme/services';
import { parseNumber } from '../../../../theme/utils';
import { IAd, IAdPosition } from '../../model';
import { ButtonEvent } from '../../../../components/form';

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
        status: [1]
    });

    public data: IAd;
    public positionItems: IAdPosition[] = [];

    constructor(
        private service: AdService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
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
                    status: res.status,
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

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IAd = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        e?.enter();
        this.service.adSave(data).subscribe({
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


}
