import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pluginRoutedComponents, PluginRoutingModule } from './plugin-routing.routing';
import { ThemeModule } from '../../../theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    PluginRoutingModule
  ],
  declarations: [...pluginRoutedComponents]
})
export class PluginModule { }
