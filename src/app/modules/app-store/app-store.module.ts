import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appStoreRoutedComponents, AppStoreRoutingModule } from './app-routing.module';
import { AppStoreService } from './app-store.service';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { ZreEditorModule } from '../../components/editor';
import { LinkRuleModule } from '../../components/link-rule';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ZreFormModule,
        ZreEditorModule,
        LinkRuleModule,
        AppStoreRoutingModule,
    ],
    declarations: [...appStoreRoutedComponents],
    providers: [
        AppStoreService
    ]
})
export class AppStoreModule { }
