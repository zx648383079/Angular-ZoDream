import { Component, OnInit, inject, viewChild } from '@angular/core';
import { MessageServiceService } from '../ms.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { FormPanelComponent } from '../../../components/desktop';

@Component({
    standalone: false,
    selector: 'app-ms-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
    private readonly service = inject(MessageServiceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    private readonly form = viewChild(FormPanelComponent);

    public isMail = true;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.isMail = params.type === 'mail';
            this.service.option(this.isMail).subscribe(res => {
                this.form().items = res.data;
            });
        });
    }


    public tapSubmit(e?: ButtonEvent) {
        const form = this.form();
        if (form.invalid) {
            this.toastrService.warning('请填写完整');
            return;
        }
        const data = form.value;
        e?.enter();
        this.service.optionSave(data, this.isMail).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
