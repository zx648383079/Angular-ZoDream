import { Component, OnInit } from '@angular/core';
import { CookieService } from '../../../theme/services';

interface ICookieGroup {
    name: string;
    active?: boolean;
    required?: boolean;
    description: string;
    items?: {
        name: string;
        time: string;
        description: string;
    }[];
    open?: boolean;
}

const CookiePolicyKey = 'cookie_policy';

@Component({
    selector: 'app-cookie-bar',
    templateUrl: './cookie-bar.component.html',
    styleUrls: ['./cookie-bar.component.scss']
})
export class CookieBarComponent implements OnInit {
    public tabIndex = 0;

    public items: ICookieGroup[] = [
        {
            name: $localize `Indispensable`,
            description: $localize `Essential Cookies are absolutely necessary for the proper functioning of a website. These cookies are anonymous to ensure the basic functionality and security features of the website.`,
            required: true,
            items: [
                {
                    name: CookiePolicyKey,
                    time: '11 months',
                    description: 'Cookies are set by the Cookie Plugin to store the user\'s consent to the use of cookies; it does not store any personal data.'
                }
            ]
        },
        {
            name: $localize `Functional`,
            description: $localize `Functionality Cookies help perform certain functions, such as sharing website content on social media platforms, collecting feedback and other third-party functions.`,
        },
        {
            name: $localize `Performances`,
            description: $localize `Performance cookies are used to understand and analyze key performance indicators of a website, which helps provide a better user experience for visitors.`,
        },
        {
            name: $localize `Analytics`,
            description: $localize `Analytics cookies are used to understand how visitors interact with a website. These cookies help provide information on metrics such as the number of visitors, bounce rates, traffic sources, and more.`,
        },
        {
            name: $localize `Advertising`,
            description: $localize `Advertising cookies are used to provide visitors with relevant advertising and marketing campaigns. These cookies track visitors across websites and collect information to deliver customized advertisements.`,
        },
        {
            name: $localize `Others`,
            description: $localize `Other unclassified cookies are those that are being analyzed but not yet classified.`,
        }
    ];

    constructor(
        private cookieService: CookieService
    ) { }

    ngOnInit() {
        this.tabIndex = this.cookieService.check(CookiePolicyKey) ? 0 : 1;
    }

    public tapAccept() {
        this.cookieService.set(CookiePolicyKey, this.tabIndex.toString());
        this.tabIndex = 0;
    }
}
