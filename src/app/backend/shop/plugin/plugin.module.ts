import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pluginRoutedComponents, PluginRoutingModule } from './plugin-routing.routing';

@NgModule({
  imports: [
    CommonModule,
    PluginRoutingModule
  ],
  declarations: [...pluginRoutedComponents]
})
export class PluginModule { }
