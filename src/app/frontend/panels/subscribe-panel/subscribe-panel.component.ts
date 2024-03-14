import { Component } from '@angular/core';
import { ButtonEvent } from '../../../components/form';
import { HttpClient } from '@angular/common/http';
import { IDataOne } from '../../../theme/models/page';
import { emailValidate } from '../../../theme/validators';
import { DialogService } from '../../../components/dialog';

@Component({
    selector: 'app-subscribe-panel',
    templateUrl: './subscribe-panel.component.html',
    styleUrls: ['./subscribe-panel.component.scss']
})
export class SubscribePanelComponent {

    public name = '';
    public email = '';

    constructor(
        private http: HttpClient,
        private toastrService: DialogService,
    ) { }

    public tapSubmit(e?: ButtonEvent) {
        if (!emailValidate(this.email)) {
            return;
        }
        e?.enter();
        this.http.post<IDataOne<boolean>>('contact/home/subscribe', {
            name: this.name,
            email: this.email
        }).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Subscribe successfully!`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }
}
