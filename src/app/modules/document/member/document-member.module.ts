import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentMemberRoutingModule, documentMemberRoutingComponents } from './routing.module';
import { DocumentService } from './document.service';

@NgModule({
    imports: [
        CommonModule,
        DocumentMemberRoutingModule
    ],
    declarations: [...documentMemberRoutingComponents],
    providers: [
        DocumentService
    ]
})
export class DocumentMemberModule { }
