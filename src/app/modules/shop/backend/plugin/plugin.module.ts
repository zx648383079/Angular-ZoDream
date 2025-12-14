import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pluginRoutedComponents, PluginRoutingModule } from './plugin-routing.routing';
import { ThemeModule } from '../../../../theme/theme.module';
import { DesktopModule } from '../../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        PluginRoutingModule,
    ],
    declarations: [...pluginRoutedComponents],
})
export class PluginModule { }
