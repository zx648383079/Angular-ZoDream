import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdService } from '../../ad.service';
import { DialogService } from '../../../../components/dialog';
import { IAdPosition } from '../../model';
import { ButtonEvent } from '../../../../components/form';

@Component({
    selector: 'app-ad-edit-position',
    templateUrl: './edit-position.component.html',
    styleUrls: ['./edit-position.component.scss']
})
export class EditPositionComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
        auto_size: [1],
        source_type: [0],
        width: ['100%'],
        height: ['100%'],
        template: [''],
        status: [1],
    });
    public data: IAdPosition;

    constructor(
        private service: AdService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.position(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    code: res.code,
                    auto_size: res.auto_size,
                    source_type: res.source_type,
                    width: res.width,
                    height: res.height,
                    template: res.template,
                    status: res.status
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IAdPosition = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        e?.enter();
        this.service.positionSave(data).subscribe({
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
