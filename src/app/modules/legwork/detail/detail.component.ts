import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { LegworkService } from '../legwork.service';
import { IService, IServiceForm } from '../model';
import { applyEach, form, min, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private readonly service = inject(LegworkService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly data = signal<IService>(null);
    public readonly dataForm = form(signal<{
        amount: number;
        items: IServiceForm[]
    }>({
        amount: 1,
        items: []
    }), schemaPath => {
        min(schemaPath.amount, 1);
        applyEach(schemaPath.items, item => {
            required(item.value, {
                when: ({valueOf}) => {
                    return !!valueOf(item.required);
                }
            })
        });
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.loadService(params.id);
        });
    }

    public readonly total = computed(() => {
        if (!this.data()) {
            return 0;
        }
        return this.data().price * this.dataForm.amount().value();
    });

    public loadService(id: any) {
        this.service.service(id).subscribe(res => {
            this.data.set(res);
            this.dataForm.items().value.set(res.form ? res.form : []);
        });
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incorrect purchase quantity `);
            return;
        }
        const remark: any = {};
        for (const item of this.dataForm.items().value()) {
            if (!item.value && item.required) {
                this.toastrService.warning($localize `${item.label} is required`);
                return;
            }
            remark[item.name] = item.value as any;
        }
        this.service.orderCreate({
            service_id: this.data().id,
            amount: this.dataForm.amount().value(),
            remark
        }).subscribe({
            next: res => {
                this.toastrService.success($localize `The order is successfully placed, waiting for payment `);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
