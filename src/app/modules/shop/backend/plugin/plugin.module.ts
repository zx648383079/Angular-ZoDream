import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pluginRoutedComponents, PluginRoutingModule } from './plugin-routing.routing';
import { ThemeModule } from '../../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        PluginRoutingModule,
    ],
    declarations: [...pluginRoutedComponents],
})
export class PluginModule { }
