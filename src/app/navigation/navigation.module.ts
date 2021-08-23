import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navigationRoutingComponents, NavigationRoutingModule } from './navigation-routing.module';

@NgModule({
    imports: [
        CommonModule,
        NavigationRoutingModule,
    ],
    declarations: [...navigationRoutingComponents]
})
export class NavigationModule { }
