import { Component, inject, signal } from '@angular/core';
import { IIconItem } from '../../../../theme/models/seo';
import { ArraySource, ButtonEvent } from '../../../../components/form';
import { form, required } from '@angular/forms/signals';
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

    public readonly invalidTip = signal('');


    public readonly typeItems: IIconItem[] = [
        {name: $localize `Discussion`, icon: 'icon-comments', value: 0},
        {name: $localize `Announcement`, icon: 'icon-paper-plane', value: 2},
        {name: $localize `Shared rental`, icon: 'icon-chain', value: 3},
    ];

    public readonly openTypeSource = ArraySource.fromOrder(
        $localize `Public`, $localize `Password`, $localize `Review`, $localize `No one is allowed`);
    public readonly dataForm = form(signal({
        name: '',
        logo: '',
        description: '',
        type: 0,
        open_type: 0,
        open_rule: '',
    }), schemePath => {
        required(schemePath.name, {message: $localize `Name is required`});
    });

    private confirmFn?: Function;
    private asyncHandler = 0;


    public open(cb: () => void) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public close() {
        this.visible.set(false);
        this.confirmFn!();
        
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.asyncTip(this.dataForm().errors()[0].message);
            return;
        }
        e?.enter();
        this.service.teamCreate(this.dataForm().value()).subscribe({
            next: _ => {
                e?.reset();
                this.page.update(v => v + 1);
            },
            error: err => {
                e?.reset();
                this.asyncTip(err.error.message);
            }
        });
    }


    public tapType(val: number) {
        this.page.set(1);
        this.dataForm.type().value.set(val);
    }

    private asyncTip(msg: string|any, time = 3000) {
        if (this.asyncHandler > 0) {
            clearTimeout(this.asyncHandler);
        }
        this.invalidTip.set(msg);
        if (!msg) {
            return;
        }
        this.asyncHandler = window.setTimeout(() => {
            this.invalidTip.set('');
        }, time);
    }
}
