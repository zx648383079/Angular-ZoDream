import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog';
import { ButtonEvent } from '../../form';
import { emptyValidate } from '../../theme/validators';
import { FrontendService } from '../frontend.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

    public title = 'About';

    public data = {
        name: '',
        email: '',
        phone: '',
        content: '',
    };

    constructor(
        private service: FrontendService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
    }

    public tapSubmit(e: ButtonEvent) {
        if (emptyValidate(this.data.name)) {
            this.toastrService.warning('请输入称呼');
            return;
        }
        if (emptyValidate(this.data.content)) {
            this.toastrService.warning('请输入内容');
            return;
        }
        e?.enter();
        this.service.feedback(this.data).subscribe({
            next: _ => {
                this.toastrService.success('提交成功');
                this.data.content = '';
                e?.reset();
            },
            error: err => {
                this.toastrService.error(err);
                e?.reset();
            }
        });
    }

}
