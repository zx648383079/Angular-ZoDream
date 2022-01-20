import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { ButtonEvent } from '../../../../form';
import { IPage } from '../../../../theme/models/page';
import { emptyValidate } from '../../../../theme/validators';
import { renderTemplateField } from '../../../util';
import { WechatService } from '../../wechat.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {

    public toTypeItems = ['全部用户', '指定分组', '指定用户'];
    public data = {
        to_type: 0,
        to: 0,
    };

    public editorData: any = {
        type: 0
    };

    constructor(
        private service: WechatService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
    }

    public formatUser = (res: IPage<any>) => {
        return res.data.map(i => {
            if (i.name) {
                return i;
            }
            return {
                id: i.id,
                name: i.note_name || i.nickname
            };
        });
    };

    public get selectUrl() {
        switch (this.data.to_type) {
            case 2:
                return 'wx/admin/user/search?wid=' + this.service.baseId;
            case 1:
                return 'wx/admin/user/group_search?wid=' + this.service.baseId;
            default:
                return null;
        }
    }

    public onEditorChange() {
        if (this.editorData.type != 3) {
            return;
        }
        if (this.data.to_type != 3) {
            this.data.to_type = 3;
            this.data.to = 0;
        }
    }


    public tapSubmit(e?: ButtonEvent) {
        if (this.data.to_type > 0 && this.data.to < 1) {
            this.toastrService.warning('请选择接收者');
            return;
        }
        if (this.editorData.type == 3 && emptyValidate(this.editorData?.content?.template_id)) {
            this.toastrService.warning('请选择模板');
            return;
        }
        this.toastrService.confirm('是否确认发送消息?', () => {
            e?.enter();
            this.service.send({...this.data, ...this.editorData}).subscribe({
                next: _ => {
                    e?.reset();
                    this.toastrService.success('发送成功');
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            })
        });
    }

}
