import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageServiceService } from '../ms.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent, FormPanelComponent, FormPanelEvent } from '../../../components/form';

@Component({
    standalone: false,
    selector: 'app-ms-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {

    @ViewChild(FormPanelComponent)
    private form: FormPanelEvent;

    public isMail = true;

    constructor(
        private service: MessageServiceService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.isMail = params.type === 'mail';
            this.service.option(this.isMail).subscribe(res => {
                this.form.items = res.data;
            });
        });
    }


    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('请填写完整');
            return;
        }
        const data = this.form.value;
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
