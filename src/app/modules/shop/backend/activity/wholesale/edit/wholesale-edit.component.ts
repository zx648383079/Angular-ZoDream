import { Component, OnInit, inject, signal } from '@angular/core';
import { IActivity, IGroupBuyStep, IWholesaleConfigure } from '../../../../model';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { ActivityService } from '../../activity.service';
import { ButtonEvent } from '../../../../../../components/form';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-wholesale-edit',
    templateUrl: './wholesale-edit.component.html',
    styleUrls: ['./wholesale-edit.component.scss']
})
export class WholesaleEditComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        description: '',
        scope: [],
        scope_type: 0,
        start_at: '',
        end_at: '',
        configure: {
            items: <IGroupBuyStep[]>[],
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IActivity<IWholesaleConfigure>;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.wholesale(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope: res.scope as any,
                    scope_type: res.scope_type,
                    start_at: res.start_at as string,
                    end_at: res.end_at as string,
                    configure: {
                        items: res.configure.items ?? []
                    }
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
        const data: any = this.dataForm().value();
        e?.enter();
        this.service.wholesaleSave(data).subscribe({
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

    public tapRemoveStep(i: number) {
        this.dataForm.configure.items().value.update(v => {
            v.splice(i, 1);
            return v;
        });
    }

    public tapAddStep() {
        this.dataForm.configure.items().value.update(v => {
            v.push({
                amount: 0,
                price: 0
            });
            return v;
        });
    }

}
