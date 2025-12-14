import { Component, inject } from '@angular/core';
import { DialogService } from '../../components/dialog';
import { ButtonEvent } from '../../components/form';
import { emptyValidate } from '../../theme/validators';
import { IShortLink } from './model';
import { ShortLinkService } from './short-link.service';

@Component({
    standalone: false,
  selector: 'app-short-link',
  templateUrl: './short-link.component.html',
  styleUrls: ['./short-link.component.scss']
})
export class ShortLinkComponent {
    private readonly toastrService = inject(DialogService);
    private readonly service = inject(ShortLinkService);


    public source = '';
    public result: IShortLink;

    public tapGenerate(e: ButtonEvent) {
        if (emptyValidate(this.source)) {
            this.toastrService.warning($localize `Please input source link`);
            return;
        }
        e?.enter();
        this.service.generate({
            title: 'unknown',
            source_url: this.source,
        }).subscribe({
            next: res => {
                e?.reset();
                this.result = res;
                this.toastrService.success($localize `Generate successfull!`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        })
    }
}
