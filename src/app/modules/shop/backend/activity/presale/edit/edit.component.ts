import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IGroupBuyStep, IPreSaleConfigure } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { form, required } from '@angular/forms/signals';
import { parseNumber } from '../../../../../../theme/utils';
import { ButtonEvent } from '../../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-shop-presale-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditPresaleComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        description: '',
        scope: 0,
        scope_type: 0,
        start_at: '',
        end_at: '',
        configure: {
            final_start_at: '',
            final_end_at: '',
            ship_at: '',
            price_type: '0',
            price: 0,
            deposit: 0,
            deposit_scale: '1',
            deposit_scale_other: 0,
            step: <IGroupBuyStep[]>[],
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.scope);
    });

    public readonly priceType = computed(() => parseNumber(this.dataForm.configure.price_type().value()));
    public readonly depositScale = computed(() => parseNumber(this.dataForm.configure.deposit_scale().value()));

    public data: IActivity<IPreSaleConfigure>;


    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.presale(params.id).subscribe(res => {
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
                        final_start_at: res.configure.final_start_at,
                        final_end_at: res.configure.final_end_at,
                        ship_at: res.configure.ship_at,
                        price_type: res.configure.price_type as any,
                        price: res.configure.price,
                        deposit: res.configure.deposit,
                        deposit_scale: res.configure.deposit_scale as any,
                        deposit_scale_other: res.configure.deposit_scale_other,
                        step: res.configure.step ?? [],
                    }
                });
            });
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
        const data: any = this.dataForm().value();
        e?.enter();
        this.service.presaleSave(data).subscribe({
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
        this.dataForm.configure.step().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    public tapAddStep() {
        this.dataForm.configure.step().value.update(v => {
            v.push({
                amount: 0,
                price: 0
            });
            return [...v];
        });
    }

}
