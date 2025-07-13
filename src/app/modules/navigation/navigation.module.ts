import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navigationRoutingComponents, NavigationRoutingModule } from './navigation-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { NavigationService } from './navigation.service';
import { DialogModule } from '../../components/dialog';
import { LinkRuleModule } from '../../components/link-rule';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        DesktopModule,
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
