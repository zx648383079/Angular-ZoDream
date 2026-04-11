import { Component, inject, signal } from '@angular/core';
import { IThemeComponent } from '../../model';
import { VisualService } from '../visual.service';

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private readonly service = inject(VisualService);


    public readonly pageItems = signal<IThemeComponent[]>([]);
    public readonly weightItems = signal<IThemeComponent[]>([]);


    public loadPage() {
        this.service.recommend({
            type: 0
        }).subscribe(res => {
            this.pageItems.set(res.data!);
        });
    }

    public loadWeight() {
        this.service.recommend({
            type: 1
        }).subscribe(res => {
            this.weightItems.set(res.data!);
        });
    }

}
