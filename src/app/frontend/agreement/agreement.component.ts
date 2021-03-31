import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IErrorResult } from '../../theme/models/page';
import { IAgreement, IAgreementGroup } from '../../theme/models/seo';
import { FrontendService } from '../frontend.service';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {

    public data: IAgreement;

    constructor(
        private service: FrontendService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) {
        
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.agreement(params.name || 'agreement').subscribe(res => {
                this.data = res;
            }, (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            });
        });
    }

    public tapScrollTo(item: IAgreementGroup) {
        const element = document.querySelector("#" + item.name);
        if (element) {
            element.scrollIntoView();
        }
    }

    public tapPrint() {
        window.print();
    }

    public tapToTop() {
        document.documentElement.scrollTop = 0;
    }
}
