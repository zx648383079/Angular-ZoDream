import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navigationRoutingComponents, NavigationRoutingModule } from './navigation-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { NavigationService } from './navigation.service';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NavigationRoutingModule,
    ],
    declarations: [...navigationRoutingComponents],
    providers: [
        NavigationService,
    ]
})
export class NavigationModule { }
