import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../components/dialog';
import { ButtonEvent } from '../../components/form';
import { IShortLink } from './model';
import { ShortLinkService } from './short-link.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-short-link',
    templateUrl: './short-link.component.html',
    styleUrls: ['./short-link.component.scss']
})
export class ShortLinkComponent {
    private readonly toastrService = inject(DialogService);
    private readonly service = inject(ShortLinkService);


    public readonly dataForm = form(signal({
        source_url: ''
    }), schemaPath => {
        required(schemaPath.source_url);
    });
    public readonly result = signal<IShortLink>(null);

    public tapGenerate(e: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Please input source link`);
            return;
        }
        e?.enter();
        this.service.generate({
            title: 'unknown',
            ...this.dataForm().value()
        }).subscribe({
            next: res => {
                e?.reset();
                this.result.set(res);
                this.toastrService.success($localize `Generate successfull!`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        })
    }
}
