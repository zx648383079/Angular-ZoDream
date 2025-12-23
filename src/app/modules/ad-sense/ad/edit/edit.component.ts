import { Component, OnInit, inject, signal } from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import {
    AdService
} from '../../ad.service';
import { DialogService } from '../../../../components/dialog';
import { IAd, IAdPosition } from '../../model';
import { ButtonEvent } from '../../../../components/form';
import { DEEPLINK_SCHEMA } from '../../../../theme/utils/deeplink';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditAdComponent implements OnInit {
    private readonly service = inject(AdService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        position_id: '',
        type: '0',
        url: '',
        content: '',
        start_at: '',
        end_at: '',
        status: true,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public positionItems: IAdPosition[] = [];

    public deepSchame = DEEPLINK_SCHEMA;

    constructor() {
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
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    position_id: res.position_id as any,
                    type: res.type as any,
                    url: res.url,
                    content: res.content,
                    start_at: res.start_at,
                    end_at: res.start_at,
                    status: res.status > 0,
                });
            });
        });
        this.route.queryParams.subscribe(params => {
            if (!params.position) {
                return;
            }
            this.dataForm.position_id().value.set(params.position);
        });
    }

    public tapBack() {
        history.back();
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
        const data: IAd = this.dataForm().value() as any;
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
