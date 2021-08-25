import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navigationRoutingComponents, NavigationRoutingModule } from './navigation-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { NavigationService } from './navigation.service';
import { DialogModule } from '../dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        NavigationRoutingModule,
    ],
    declarations: [...navigationRoutingComponents],
    providers: [
        NavigationService,
    ]
})
export class NavigationModule { }
