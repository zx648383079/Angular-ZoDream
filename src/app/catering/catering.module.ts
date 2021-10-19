import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cateringRoutingComponents, CateringRoutingModule } from './catering-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '../auth/auth.module';
import { ContextMenuModule } from '../context-menu';
import { ZreFormModule } from '../form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        CateringRoutingModule,
        AuthModule,
        ContextMenuModule,
        ZreFormModule,
    ],
    declarations: [...cateringRoutingComponents]
})
export class CateringModule { }
