import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../dialog';
import { IErrorResult } from '../../theme/models/page';
import { IAgreement, IAgreementGroup } from '../../theme/models/seo';
import { ThemeService } from '../../theme/services';
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
        private toastrService: DialogService,
        private themeService: ThemeService,
    ) {
        
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.agreement(params.name || 'agreement').subscribe({
                next: res => {
                    this.data = res;
                    this.themeService.setTitle(res.title);
                }, 
                error: (err: IErrorResult) => {
                    this.toastrService.warning(err.error.message);
                }
            });
        });
    }

    public tapScrollTo(item: IAgreementGroup) {
        const element = document.querySelector('#' + item.name);
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
