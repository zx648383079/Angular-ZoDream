import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bookMemberRoutingComponents, BookMemberRoutingModule } from './book-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        DesktopModule,
        BookMemberRoutingModule,
        ZreFormModule,
    ],
    declarations: [...bookMemberRoutingComponents]
})
export class BookMemberModule { }
