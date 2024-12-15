import { Directive, TemplateRef } from '@angular/core';

@Directive({
    standalone: false,
    selector: 'ng-template[appSwiperItem]'
})
export class SwiperItemDirective {
    constructor(
        public tplRef: TemplateRef<any>
    ) { }
}
