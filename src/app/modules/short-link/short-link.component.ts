import { Component } from '@angular/core';
import { DialogService } from '../../components/dialog';
import { ButtonEvent } from '../../components/form';
import { emptyValidate } from '../../theme/validators';
import { IShortLink } from './model';
import { ShortLinkService } from './short-link.service';

@Component({
  selector: 'app-short-link',
  templateUrl: './short-link.component.html',
  styleUrls: ['./short-link.component.scss']
})
export class ShortLinkComponent {

    public source = '';
    public result: IShortLink;

    constructor(
        private toastrService: DialogService,
        private service: ShortLinkService
    ) { }

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
