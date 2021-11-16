import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navigationRoutingComponents, NavigationRoutingModule } from './navigation-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { NavigationService } from './navigation.service';
import { DialogModule } from '../dialog';
import { LinkRuleModule } from '../link-rule';
import { ZreFormModule } from '../form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        NavigationRoutingModule,
        LinkRuleModule,
        ZreFormModule,
    ],
    declarations: [...navigationRoutingComponents],
    providers: [
        NavigationService,
    ]
})
export class NavigationModule { }
