import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bookMemberRoutingComponents, BookMemberRoutingModule } from './book-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        BookMemberRoutingModule,
        ZreFormModule,
    ],
    declarations: [...bookMemberRoutingComponents]
})
export class BookMemberModule { }
