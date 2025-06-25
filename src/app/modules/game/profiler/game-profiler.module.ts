import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ThemeModule } from '../../../theme/theme.module';
import { GameProfilerRoutingModule, gameProfilerRoutedComponents } from './routing.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        DialogModule,
        GameProfilerRoutingModule
    ],
    declarations: [... gameProfilerRoutedComponents]
})
export class GameProfilerModule { }
