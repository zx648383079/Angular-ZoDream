import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IGoodsResult, IMixConfigure, IMixGoods } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-shop-mix-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class EditMixComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        description: '',
        scope_type: 0,
        start_at: '',
        end_at: '',
        configure: {
            price: 0,
            goods: <IMixGoods[]>[]
        },
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IActivity<IMixConfigure>;
    public dialogOpen = false;


    public get configure() {
        return this.dataForm.configure;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.mix(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope_type: res.scope_type,
                    start_at: res.start_at as string,
                    end_at: res.end_at as string,
                    configure: {
                        price: res.configure.price,
                        goods: res.configure.goods ?? []
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
        const data: IActivity<any> = this.dataForm().value() as any;
        let total = 0;
        data.configure.goods = data.configure.goods.map(i => {
            total += i.amount * i.price;
            return {
                goods_id: i.goods_id,
                amount: i.amount,
                price: i.price
            };
        });
        if (data.configure.goods.length < 2) {
            this.toastrService.warning('组合中商品至少两种');
            return;
        }
        if (parseFloat(data.configure.price) !== total) {
            this.toastrService.warning('组合中商品总价[' + total +']与组合价不一致');
            return;
        }
        e?.enter();
        this.service.mixSave(data).subscribe({
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

    public tapRemoveItem(i: number) {
        this.configure.goods().value.update(v => {
            v.splice(i, 1);
            return v;
        });
    }

    public tapAddItem() {
        this.dialogOpen = true;
    }

    public onGoodsSelected(event: IGoodsResult|IGoodsResult[]) {
        this.dialogOpen = false;
        if (!(event instanceof Array)) {
            event = [event];
        }
        if (event.length < 1) {
            return;
        }
        for (const item of event) {
            if (this.indexOf(item.id) >= 0) {
                continue;
            }
            this.configure.goods().value.update(v => {
                v.push({
                    goods_id: item.id,
                    goods: item as any,
                    price: item.price,
                    amount: 1,
                })
                return v;
            });
        }
    }

    private indexOf(goodsId: number): number {
        const items = this.configure.goods().value();
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].goods_id === goodsId) {
                return i;
            }
        }
        return -1;
    }
}
