import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { DialogBoxComponent } from '../../../../components/dialog';
import { emptyValidate } from '../../../../theme/validators';
import { FinanceService } from '../../finance.service';
import { IConsumptionChannel } from '../../model';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

    public items: IConsumptionChannel[] = [];
    public isLoading = false;
    public keywords = '';
    public editData: IConsumptionChannel = {
        id: undefined,
        name: '',
    } as any;

    constructor(
        private service: FinanceService,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.channelList({
            keywords: this.keywords,
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.tapRefresh();
    }

    public tapRemove(item: IConsumptionChannel) {
        if (!confirm('确定删除“' + item.name + '”消费渠道？')) {
            return;
        }
        this.service.channelRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    open(modal: DialogBoxComponent, item?: IConsumptionChannel) {
        this.editData = item ? {...item} : {
            id: undefined,
            name: '',
        } as any;
        modal.open(() => {
            this.service.channelSave({...this.editData}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => {
            return !emptyValidate(this.editData.name)
        });
    }
}
