import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { DialogBoxComponent } from '../../../../../components/dialog';
import { IOption } from '../../../../../theme/models/seo';
import { emptyValidate } from '../../../../../theme/validators';
import { CmsService } from '../../cms.service';

@Component({
  selector: 'app-site-option',
  templateUrl: './site-option.component.html',
  styleUrls: ['./site-option.component.scss']
})
export class SiteOptionComponent implements OnInit {

    public items: IOption[] = [];

    public editData: IOption = {} as any;
    public typeItems = [
        {value: 'text', name: '文本'},
        {value: 'textarea', name: '多行文本'},
        {value: 'select', name: '下拉选择'},
        {value: 'radio', name: '单选'},
        {value: 'checkbox', name: '多选'},
        {value: 'switch', name: '开关'},
        {value: 'image', name: '图片'},
        {value: 'file', name: '文件'},
        {value: 'basic_editor', name: '迷你编辑器'},
        {value: 'editor', name: '编辑器'},
        {value: 'json', name: 'JSON'},
    ];

    private id = 0;

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
        
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = parseInt(params.id, 10);
            this.service.option(this.id).subscribe(res => {
                this.items = res.data.map(item => {
                    if (['select', 'radio', 'checkbox'].indexOf(item.type)) {
                        item.items = this.strToArr(item.default_value);
                    }
                    if (item.type === 'checkbox') {
                        item.values = item.value.split(',');
                    }
                    return item;
                });
            });
        });
    }

    private strToArr(val: any): string[] {
        if (typeof val === 'object') {
            return val;
        }
        const items: string[] = [];
        val.toString().split('\n').forEach((item: string) => {
            item = item.replace('\r', '').trim();
            if (!item || item.length < 1) {
                return;
            }
            if (items.indexOf(item) >= 0) {
                return;
            }
            items.push(item);
        });
        return items;
    }

    public tapSubmit() {
        this.service.optionSave(this.id, this.items).subscribe({
            next: res => {
                this.toastrService.success('保存成功');
                history.back();
            }, error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapEditOption(modal: any, item?: IOption) {
        this.editData = item || {
            name: '',
            code: '',
            type: 'text',
            default_value: '',
            value: '',
        } as any;
        this.tapOpenModal(modal);
    }

    public tapOpenModal(modal: DialogBoxComponent) {
        modal.openCustom(value => {
            if (value === 'remove') {
                if (!confirm('确定删除此项')) {
                    return;
                }
                this.items = this.items.filter(i => {
                    return i.code !== i.code;
                });
                return;
            }
            if (emptyValidate(this.editData.code)) {
                return false;
            }
            for (const item of this.items) {
                if (item.code === this.editData.code) {
                    return;
                }
            }
            this.items.push(this.editData);
        });
    }

}
