import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: 'ng-template[appSwiperItem]'
})
export class SwiperItemDirective {
    constructor(
        public tplRef: TemplateRef<any>
    ) { }
}
