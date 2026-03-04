import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DialogService } from '../../components/dialog';
import { IEmoji } from '../../theme/models/seo';
import { OnlineService } from './online.service';
import { form, required } from '@angular/forms/signals';
import { KeepAliveService } from '../../theme/services/keep-alive.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-online-service',
    templateUrl: './online-service.component.html',
    styleUrls: ['./online-service.component.scss']
})
export class OnlineServiceComponent {
    private readonly service = inject(OnlineService);
    private readonly liveService = inject(KeepAliveService);
    private readonly toastrService = inject(DialogService);
    private readonly destroyRef = inject(DestroyRef);

    public readonly dialogOpen = signal(false);
    public readonly dataForm = form(signal({
        content: ''
    }), schemaPath => {
        required(schemaPath.content);
    });
    public readonly items = signal<any[]>([]);
    private nextTime = 0;
    private startTime = 0;
    private isLoading = false;

    constructor() {
        this.liveService.pulsed.pipe(
            takeUntilDestroyed(this.destroyRef),
            filter(i => i.ms_count > 0)
        ).subscribe(res => {
            this.tapNext();
        });
    }

    public tapOpenChat() {
        this.dialogOpen.set(true);
        if (this.liveService.token.length > 0) {
            this.tapNext();
        }
    }

    public tapSend() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Please input the content of the inquiry`);
            return;
        }
        this.send(this.dataForm().value());
        this.dataForm.content().value.set('');
    }

    public tapUploadImage(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        for (let i = 0; i < files.length; i++) {
            form.append('file[]', files[i], files[i].name);
        }
        this.send(form);
    }

    public tapEmoji(item: IEmoji) {
        this.dataForm.content().value.update(v => v + (item.type > 0 ? item.content : '[' + item.name + ']'));
    }

    public onKeyDown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapSend();
    }

    public tapMore(lastId: number) {
        if (lastId < 1) {
            return;
        }
        this.service.getList({
            session_token: this.liveService.token,
            last_id: lastId,
        }).subscribe((res: any) => {
            if (res.data.length > 0) {
                this.items.set([].concat(res.data, this.items));
            }
        });
    }

    private send(data: any) {
        if (data instanceof FormData) {
            data.append('session_token', this.liveService.token);
            data.append('start_time', this.nextTime as any);
        } else {
            data.session_token = this.liveService.token;
            data.start_time = this.nextTime;
        }
        this.isLoading = true;
        this.service.send(data).subscribe({
            next:(res: any) => {
                this.items.update(v => {
                    return [...v, ...res.data];
                });
                this.nextTime = res.next_time;
                if (!this.startTime) {
                    this.startTime = this.nextTime;
                }
                this.liveService.token = res.session_token;
                this.isLoading = false;
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    private tapNext() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.getList({
            session_token: this.liveService.token,
            start_time: this.nextTime,
        }).subscribe({
            next: (res: any) => {
                if (res.data.length > 0) {
                    this.items.update(v => {
                        return [...v, ...res.data];
                    });
                }
                this.nextTime = res.next_time;
                if (!this.startTime) {
                    this.startTime = this.nextTime;
                }
                this.liveService.token = res.session_token;
                this.isLoading = false;
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }
}
