import { Component, inject, signal } from '@angular/core';
import { ButtonEvent } from '../../../components/form';
import { HttpClient } from '@angular/common/http';
import { IDataOne } from '../../../theme/models/page';
import { emailValidate } from '../../../theme/validators';
import { DialogService } from '../../../components/dialog';
import { email, form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-subscribe-panel',
    templateUrl: './subscribe-panel.component.html',
    styleUrls: ['./subscribe-panel.component.scss']
})
export class SubscribePanelComponent {
    private readonly http = inject(HttpClient);
    private readonly toastrService = inject(DialogService);


    public readonly dataForm = form(signal({
        name: '',
        email: ''
    }), schemaPath => {
        required(schemaPath.email);
        email(schemaPath.email);
    });

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            return;
        }
        e?.enter();
        this.http.post<IDataOne<boolean>>('contact/home/subscribe', this.dataForm().value()).subscribe({
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
