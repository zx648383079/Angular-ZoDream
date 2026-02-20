import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ArraySource, ButtonEvent, NetSource } from '../../../../../components/form';
import { emptyValidate } from '../../../../../theme/validators';
import { BotService } from '../../bot.service';
import { form } from '@angular/forms/signals';
import { parseNumber } from '../../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-bot-m-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.scss']
})
export class SendComponent {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);


    public toTypeItems = ['全部用户', '指定分组', '指定用户'];
    public readonly dataForm = form(signal({
        to_type: '0',
        to: 0,
    }));

    public editorData: any = {
        type: 0
    };


    public readonly toSource = computed(() => {
        switch (this.dataForm.to_type().value()) {
            case '2':
                return this.service.userSource();
            case '1':
                return this.service.groupSource();
            default:
                return ArraySource.empty;
        }
    });

    public onEditorChange() {
        if (this.editorData.type != 3) {
            return;
        }
        this.dataForm().value.update(v => {
            if (v.to_type != '3') {
                v.to_type = '3';
                v.to = 0;
            }
            return v;
        });
        
    }


    public tapSubmit(e?: ButtonEvent) {
        const data = this.dataForm().value();
        if (parseNumber(data.to_type) > 0 && data.to < 1) {
            this.toastrService.warning('请选择接收者');
            return;
        }
        if (this.editorData.type == 3 && emptyValidate(this.editorData?.content?.template_id)) {
            this.toastrService.warning('请选择模板');
            return;
        }
        this.toastrService.confirm('是否确认发送消息?', () => {
            e?.enter();
            this.service.send({...data, ...this.editorData}).subscribe({
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
