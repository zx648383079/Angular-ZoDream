import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleBlockComponent } from './rule-block/rule-block.component';

const COMPONENTS = [
    RuleBlockComponent,
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [...COMPONENTS],
    exports: [
        ...COMPONENTS,
    ]
})
export class LinkRuleModule { }
