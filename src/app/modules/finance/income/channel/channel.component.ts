import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { FinanceService } from '../../finance.service';
import { IConsumptionChannel } from '../../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-finance-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
    private readonly service = inject(FinanceService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<IConsumptionChannel[]>([]);
    public readonly isLoading = signal(false);
    public readonly queries = form(signal({
        keywords: ''
    }));
    public readonly editForm = form(signal({
        id: 0,
        name: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.tapRefresh();
    }

    public tapBack() {
        history.back();
    }

    public tapRefresh() {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.channelList(this.queries().value()).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IConsumptionChannel) {
        this.toastrService.confirm('确定删除“' + item.name + '”消费渠道？', () => {
            this.service.channelRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

    public open(modal: DialogEvent, item?: IConsumptionChannel) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.channelSave({...this.editForm().value()}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }
}
