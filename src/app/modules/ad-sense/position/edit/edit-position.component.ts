import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdService } from '../../ad.service';
import { DialogService } from '../../../../components/dialog';
import { IAdPosition } from '../../model';
import { ButtonEvent } from '../../../../components/form';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-ad-edit-position',
    templateUrl: './edit-position.component.html',
    styleUrls: ['./edit-position.component.scss']
})
export class EditPositionComponent implements OnInit {
    private readonly service = inject(AdService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        code: '',
        auto_size: 1,
        source_type: 0,
        width: '100%',
        height: '100%',
        template: '',
        status: 1,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.code);
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.position(params.id).subscribe(res => {
                this.dataModel.set({
                    id: 0,
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
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IAdPosition = this.dataForm().value() as any;
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
