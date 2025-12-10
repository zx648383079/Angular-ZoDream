import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
    standalone: false,
    selector: 'ng-template[appSwiperItem]'
})
export class SwiperItemDirective {    tplRef = inject<TemplateRef<any>>(TemplateRef);

}
