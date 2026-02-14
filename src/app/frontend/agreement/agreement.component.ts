import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../components/dialog';
import { IErrorResult } from '../../theme/models/page';
import { IAgreement, IAgreementGroup } from '../../theme/models/seo';
import { ThemeService } from '../../theme/services';
import { FrontendService } from '../frontend.service';
import { NavigationDisplayMode } from '../../theme/models/event';

@Component({
    standalone: false,
    selector: 'app-agreement',
    templateUrl: './agreement.component.html',
    styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent {
    private readonly service = inject(FrontendService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public readonly data = signal<IAgreement>(null);
    public readonly navVisible = signal(true);

    constructor() {
        this.route.params.subscribe(params => {
            this.service.agreement(params.name || 'agreement').subscribe({
                next: res => {
                    this.data.set(res);
                    this.themeService.titleChanged.next(res.title);
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
        this.navVisible.set(false);
        this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Collapse);
        setTimeout(() => {
            window.print();
            this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Inline);
            this.navVisible.set(true);
        }, 100);
    }

    public tapToTop() {
        document.documentElement.scrollTop = 0;
    }
}
