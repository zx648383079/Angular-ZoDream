import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { resourceStoreRoutedComponents, ResourceStoreRoutingModule } from './resource-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { ResourceService } from './resource.service';
import { LinkRuleModule } from '../../components/link-rule';
import { ZreEditorModule } from '../../components/editor';
import { DesktopModule } from '../../components/desktop';
import { AuthSharedModule } from '../auth/auth-shared.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ZreFormModule,
        ZreEditorModule,
        LinkRuleModule,
        AuthSharedModule,
        ResourceStoreRoutingModule
    ],
    declarations: [...resourceStoreRoutedComponents],
    providers: [
        ResourceService,
    ]
})
export class ResourceStoreModule { }
