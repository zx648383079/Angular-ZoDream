import { Component, OnInit, inject } from '@angular/core';
import { DialogService } from '../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-example-tour',
    templateUrl: './tour.component.html',
    styleUrls: ['./tour.component.scss']
})
export class ExampleTourComponent  {
    private readonly toastrService = inject(DialogService);


    public tapPlay() {
        this.toastrService.tour({
            items: [
                {
                    selector: '.nav-bar',
                    content: '这是菜单',
                },
                {
                    selector: 'app-page-tip',
                    content: '这是页面指引说明',
                },
                {
                    selector: '.btn-primary',
                    content: '点击开启引导程序',
                }
            ]
        });
    }
}
