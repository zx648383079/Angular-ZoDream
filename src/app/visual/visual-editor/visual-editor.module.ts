import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualEditorComponent } from './visual-editor.component';
import { ThemeModule } from '../../theme/theme.module';
import { ContextMenuModule } from '../../context-menu/context-menu.module';
import { DialogModule } from '../../dialog';
import { EditorLayerComponent } from './editor-layer/editor-layer.component';
import { EditorPropertyComponent } from './editor-property/editor-property.component';
import { EditorRuleBarComponent } from './editor-rule-bar/editor-rule-bar.component';
import { EditorShellComponent } from './editor-shell/editor-shell.component';
import { EditorSoulComponent } from './editor-soul/editor-soul.component';
import { EditorToolBarComponent } from './editor-tool-bar/editor-tool-bar.component';
import { EditorWidgetComponent } from './editor-widget/editor-widget.component';
import { EditorService } from './editor.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MobileBarComponent } from './editor-shell/mobile-bar/mobile-bar.component';
import { ShortcutInfoComponent } from './editor-soul/shortcut-info/shortcut-info.component';
import { CatalogListComponent } from './editor-layer/catalog-list/catalog-list.component';
import { CatalogItemComponent } from './editor-layer/catalog-item/catalog-item.component';
import { EditorReflectionComponent } from './editor-reflection/editor-reflection.component';
import { controlComponents } from './editor-widget/control';
import { inputComponents } from './editor-widget/input';
import { panelComponents } from './editor-widget/panel';
import { TabBarComponent } from './editor-shell/tab-bar/tab-bar.component';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NgbModule,
        ContextMenuModule,
        DialogModule,
    ],
    declarations: [	
        VisualEditorComponent, 
        EditorLayerComponent, 
        EditorPropertyComponent,
        EditorRuleBarComponent,
        EditorShellComponent,
        EditorSoulComponent,
        EditorToolBarComponent,
        EditorWidgetComponent,
        EditorReflectionComponent,

        MobileBarComponent,
        TabBarComponent,
        ShortcutInfoComponent,
        CatalogListComponent,
        CatalogItemComponent,
        ...controlComponents,
        ...inputComponents,
        ...panelComponents,
   ],
    providers: [
        EditorService,
    ],
    exports: [
        VisualEditorComponent,
    ]
})
export class VisualEditorModule { }
