import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IGoods, ILotteryConfigure, ILotteryGift } from '../../../../model';
import { ActivityService } from '../../activity.service';
import { SearchDialogComponent } from '../../../../components';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-shop-lottery-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class EditLotteryComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    private readonly modal = viewChild(SearchDialogComponent);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        description: '',
        scope: [],
        scope_type: '0',
        start_at: '',
        end_at: '',
        configure: {
            time_price: 0,
            buy_times: 0,
            start_times: 0,
            btn_text: '',
            over_text: '',
            items: <ILotteryGift[]>[{
                name: '未中奖',
                goods_id: 0,
                chance: 0,
                color: '',
            }]
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IActivity<ILotteryConfigure>;

    public readonly scopeType = computed(() => {
        const val = this.dataForm.scope_type().value();
        return typeof val === 'number' ? val : parseInt(val, 10);
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.lottery(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope_type: res.scope_type as any,
                    scope: [],
                    start_at: res.start_at as string,
                    end_at: res.end_at as string,
                    configure: {
                        time_price: res.configure.time_price,
                        buy_times: res.configure.buy_times,
                        start_times: res.configure.start_times,
                        btn_text: res.configure.btn_text,
                        over_text: res.configure.over_text,
                        items: res.configure.items
                    }
                });
            });
        });
    }

    public tapBack() {
        this.location.back();
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
        const data = this.dataForm().value();
        data.configure.items = data.configure.items.map(i => {
            return {
                goods_id: i.goods_id,
                name: i.name,
                chance: i.chance,
                color: i.color,
            };
        });
        if (data.configure.items.length < 2 || data.configure.items.length > 8) {
            this.toastrService.warning('组合中商品至少两种,最多8种');
            return;
        }
        e?.enter();
        this.service.lotterySave(data).subscribe({
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
        this.dataForm.configure.items().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    public tapAddItem() {
        this.modal().open((event: IGoods[]) => {
            if (event.length < 1) {
                return;
            }
            for (const item of event) {
                if (this.indexOf(item.id) >= 0) {
                    continue;
                }
                this.dataForm.configure.items().value.update(v => {
                    v.push({
                        goods_id: item.id,
                        goods: item,
                        name: '',
                        chance: 0,
                        color: '',
                    });
                    return v;
                });
            }
        });
    }

    private indexOf(goodsId: number): number {
        const items = this.dataForm.configure.items().value();
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].goods_id === goodsId) {
                return i;
            }
        }
        return -1;
    }



    public tapUpItem(i: number) {
        if (i < 1) {
            return;
        }
        this.dataForm.configure.items().value.update(v => {
            v[i] = v.splice(i - 1, 1, v[i])[0];
            return [...v];
        });
        
    }

    public tapDownItem(i: number) {
        this.dataForm.configure.items().value.update(v => {
            if (i < v.length - 1) {
                v[i] = v.splice(i + 1, 1, v[i])[0];
            }
            return [...v];
        });
        
    }
}
