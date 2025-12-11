import { Component, inject, input } from '@angular/core';
import { DialogConfirmFn, DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { IItem } from '../../../theme/models/seo';
import { emptyValidate } from '../../../theme/validators';
import { IWebPage } from '../model';
import { NavigationService } from '../navigation.service';

@Component({
    standalone: false,
    selector: 'app-navigation-report-dialog',
    templateUrl: './report-dialog.component.html',
    styleUrls: ['./report-dialog.component.scss'],
})
export class ReportDialogComponent {
    private service = inject(NavigationService);
    private toastrService = inject(DialogService);


    /**
     * 是否显示
     */
    public visible = false;
    public data: IWebPage;
    private confirmFn: DialogConfirmFn;


    public typeItems: {
        label: string;
        items: IItem[];
    }[] = [
        {label: $localize `Report illegal and bad information`, items: [
            {name: $localize `Pornographic vulgarity`, value: 11},  
            {name: $localize `Suspected of illegal crime`, value: 12},  
            {name: $localize `Gambling`, value: 13},  
            {name: $localize `Terrorist violence`, value: 14},  
            {name: $localize `Prohibited items`, value: 15},  
            {name: $localize `Shopping transaction fraud`, value: 16},
            {name: $localize `Phishing website/virus Trojan`, value: 17},  
            {name: $localize `Others`, value: 99},
        ]},
        {label: $localize `Intellectual property infringement`, items:[
            {name: $localize `Copyright`, value: 20},  
            {name: $localize `Patent`, value: 21},
        ]},
    ];
    public typeIndex = 0;
    public content = '';
    public email = '';

    public get typeOptionItems() {
        return this.typeItems[this.typeIndex].items;
    }

    public get wordSize() {
        return Math.max(0, 500 - this.content.length);
    }

    public open(data: IWebPage, cb?: DialogConfirmFn) {
        this.confirmFn = cb;
        this.data = data;
        this.visible = true;
        this.content = '';
    }

    public close() {
        this.visible = false;
    }

    public tapSubmit(e: ButtonEvent) {
        const data = {
            item_type: 31,
            item_id: this.data.id,
            type: 99,
            title: '',
            content: `[${this.data.title}](${this.data.link}):${this.content}`,
            email: this.email
        };
        if (emptyValidate(data.content)) {
            this.toastrService.warning($localize `Please input a problem description`);
            return;
        }
        const option = [];
        for (const item of this.typeOptionItems) {
            if (item.checked) {
                data.type = item.value as number;
                option.push(item.name);
            }
        }
        if (option.length < 1) {
            this.toastrService.warning($localize `Please select report type`);
            return;
        }
        data.title = option.join('、');
        e?.enter();
        this.service.report(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Report successful, waiting for manual review`);
                this.visible = false;
                this.confirmFn && this.confirmFn();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
