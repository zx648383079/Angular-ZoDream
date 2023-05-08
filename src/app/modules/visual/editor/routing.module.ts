import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualEditorComponent } from './visual-editor.component';
import { CatalogItemComponent } from './editor-layer/catalog-item/catalog-item.component';
import { CatalogListComponent } from './editor-layer/catalog-list/catalog-list.component';
import { EditorLayerComponent } from './editor-layer/editor-layer.component';
import { AnimationInputComponent } from './editor-property/animation-input/animation-input.component';
import { BorderInputComponent } from './editor-property/border-input/border-input.component';
import { ColorInputComponent } from './editor-property/color-input/color-input.component';
import { EditorPropertyComponent } from './editor-property/editor-property.component';
import { MarginInputComponent } from './editor-property/margin-input/margin-input.component';
import { MaskInputComponent } from './editor-property/mask-input/mask-input.component';
import { PositionInputComponent } from './editor-property/position-input/position-input.component';
import { RadiusInputComponent } from './editor-property/radius-input/radius-input.component';
import { ShadowInputComponent } from './editor-property/shadow-input/shadow-input.component';
import { SideSelectComponent } from './editor-property/side-select/side-select.component';
import { EditorReflectionComponent } from './editor-reflection/editor-reflection.component';
import { EditorRuleBarComponent } from './editor-rule-panel/editor-rule-bar/editor-rule-bar.component';
import { EditorRulePanelComponent } from './editor-rule-panel/editor-rule-panel.component';
import { EditorScaleBarComponent } from './editor-scale-bar/editor-scale-bar.component';
import { EditorScrollBarComponent } from './editor-scroll-bar/editor-scroll-bar.component';
import { EditorShellComponent } from './editor-shell/editor-shell.component';
import { MobileBarComponent } from './editor-shell/mobile-bar/mobile-bar.component';
import { TabBarComponent } from './editor-shell/tab-bar/tab-bar.component';
import { EditorSoulComponent } from './editor-soul/editor-soul.component';
import { ShortcutInfoComponent } from './editor-soul/shortcut-info/shortcut-info.component';
import { EditorToolBarComponent } from './editor-tool-bar/editor-tool-bar.component';
import { controlComponents } from './editor-widget/control';
import { EditorWidgetComponent } from './editor-widget/editor-widget.component';
import { inputComponents } from './editor-widget/input';
import { panelComponents } from './editor-widget/panel';
import { EditorWorkBodyComponent } from './editor-work-body/editor-work-body.component';
import { EditorWindowComponent } from './editor-window/editor-window.component';

const routes: Routes = [
    {
        path: '', 
        component: VisualEditorComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisualEditorRoutingModule { }

export const visualEditorRoutingComponents = [
    VisualEditorComponent,
    VisualEditorComponent, 
    EditorWindowComponent,
    EditorWorkBodyComponent,
    EditorLayerComponent, 
    EditorPropertyComponent,
    EditorRulePanelComponent,
    EditorScaleBarComponent,
    EditorRuleBarComponent,
    EditorShellComponent,
    EditorSoulComponent,
    EditorToolBarComponent,
    EditorWidgetComponent,
    EditorReflectionComponent,
    EditorScrollBarComponent,

    MobileBarComponent,
    TabBarComponent,
    ShortcutInfoComponent,
    CatalogListComponent,
    CatalogItemComponent,
    AnimationInputComponent,
    BorderInputComponent,
    ColorInputComponent,
    MarginInputComponent,
    MaskInputComponent,
    PositionInputComponent,
    RadiusInputComponent,
    ShadowInputComponent,
    SideSelectComponent,

    ...controlComponents,
    ...inputComponents,
    ...panelComponents,
];
