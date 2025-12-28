import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { navigationRoutingComponents, NavigationRoutingModule } from './navigation-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { NavigationService } from './navigation.service';
import { DialogModule } from '../../components/dialog';
import { LinkRuleModule } from '../../components/link-rule';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DialogModule,
        DesktopModule,
        NavigationRoutingModule,
        LinkRuleModule,
        ZreFormModule,
        NgOptimizedImage
    ],
    declarations: [...navigationRoutingComponents],
    providers: [
        NavigationService,
    ]
})
export class NavigationModule { }
