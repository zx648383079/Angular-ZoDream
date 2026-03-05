import { Component, inject, signal } from '@angular/core';
import { IIconItem } from '../../../../theme/models/seo';
import { ArraySource } from '../../../../components/form';
import { form } from '@angular/forms/signals';
import { ChatService } from '../../chat.service';

@Component({
    standalone: false,
    selector: 'app-chat-team-create',
    templateUrl: './team-create.component.html',
    styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent {

    private readonly service = inject(ChatService);

    public readonly visible = signal(false);
    public readonly page = signal(0);


    public readonly typeItems: IIconItem[] = [
        {name: '交流讨论', icon: 'icon-comments', value: 0},
        {name: '公告', icon: 'icon-paper-plane', value: 2},
        {name: '共享租借', icon: 'icon-chain', value: 3},
    ];

    public readonly openTypeSource = ArraySource.fromOrder('公开', '口令', '审核', '不允许任何人');
    public readonly dataForm = form(signal({
        name: '',
        logo: '',
        description: '',
        type: 0,
        open_type: 0,
        open_rule: '',
    }));

    private confirmFn: Function;


    public open(cb: () => void) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public close(isOk = false) {
        this.visible.set(false);
        this.confirmFn();
        if (!isOk) {
            return;
        }
        this.service.teamCreate(this.dataForm().value()).subscribe(res => {

        });
    }


    public tapType(val: number) {
        this.page.set(1);
        this.dataForm.type().value.set(val);
    }
}
