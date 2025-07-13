import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pluginRoutedComponents, PluginRoutingModule } from './plugin-routing.routing';
import { ThemeModule } from '../../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DesktopModule } from '../../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ReactiveFormsModule,
        PluginRoutingModule,
    ],
    declarations: [...pluginRoutedComponents],
})
export class PluginModule { }
