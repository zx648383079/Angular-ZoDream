import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { bookBackendRoutingComponents, BookBackendRoutingModule } from './backend-routing.module';
import { BookService } from './book.service';
import { DialogModule } from '../../dialog';
import { ZreFormModule } from '../../form';
import { ZreEditorModule } from '../../editor/editor.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        BookBackendRoutingModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        DialogModule,
        ZreFormModule,
        ZreEditorModule,
    ],
    declarations: [...bookBackendRoutingComponents],
    providers: [
        BookService,
    ]
})
export class BackendModule { }
