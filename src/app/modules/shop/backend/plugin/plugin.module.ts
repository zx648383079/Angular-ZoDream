import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pluginRoutedComponents, PluginRoutingModule } from './plugin-routing.routing';
import { ThemeModule } from '../../../../theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NgbModule,
        ReactiveFormsModule,
        PluginRoutingModule,
    ],
    declarations: [...pluginRoutedComponents],
})
export class PluginModule { }
