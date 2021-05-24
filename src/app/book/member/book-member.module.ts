import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bookMemberRoutingComponents, BookMemberRoutingModule } from './book-routing.module';

@NgModule({
    imports: [
        CommonModule,
        BookMemberRoutingModule,
    ],
    declarations: [...bookMemberRoutingComponents]
})
export class BookMemberModule { }
