import { assetUri } from '../../../theme/utils';
import { EditorCodeComponent } from '../modal/code/editor-code.component';
import { EditorColorComponent } from '../modal/color/editor-color.component';
import { EditorDropdownComponent } from '../modal/dropdown/editor-dropdown.component';
import { EditorFileComponent } from '../modal/file/editor-file.component';
import { EditorImageComponent } from '../modal/image/editor-image.component';
import { EditorLinkComponent } from '../modal/link/editor-link.component';
import { EditorMapComponent } from '../modal/map/editor-map.component';
import { EditorTableComponent } from '../modal/table/editor-table.component';
import { EditorTextComponent } from '../modal/text/editor-text.component';
import { EditorVideoComponent } from '../modal/video/editor-video.component';
import { EditorCommandType } from '../model';
import { EDITOR_ADD_TOOL, EDITOR_CLOSE_TOOL, EDITOR_CODE_TOOL, EDITOR_ENTER_TOOL, EDITOR_FULL_SCREEN_TOOL, EDITOR_IMAGE_TOOL, EDITOR_LINK_TOOL, EDITOR_MORE_TOOL, EDITOR_OVERLAY_TOOL, EDITOR_PREVIEW_TOOL, EDITOR_REDO_TOOL, EDITOR_TABLE_TOOL, EDITOR_UNDO_TOOL, EDITOR_VIDEO_TOOL } from './event';
import { IEditorModule } from './option';

export const EditorModules: IEditorModule[] = [
    {
        name: 'text',
        icon: 'icon-char',
        label: $localize `Edit Text`,
    },
    {
        name: 'paragraph',
        icon: 'icon-paragraph',
        label: $localize `Edit Paragraph'`,
    },
    {
        name: EDITOR_ADD_TOOL,
        icon: 'icon-plus',
        label: $localize `Add Content`,
    },
    {
        name: EDITOR_UNDO_TOOL,
        icon: 'icon-undo',
        label: $localize `Undo`,
        hotKey: 'Ctrl+Z',
        handler(editor) {
            editor.undo();
        }
    },
    {
        name: EDITOR_REDO_TOOL,
        icon: 'icon-redo',
        label: $localize `Redo`,
        hotKey: 'Ctrl+Shift+Z',
        handler(editor) {
            editor.redo();
        }
    },
    {
        name: EDITOR_MORE_TOOL,
        icon: 'icon-ellipsis-v',
        label: $localize `More`
    },
    {
        name: EDITOR_PREVIEW_TOOL,
        icon: 'icon-eye',
        label: $localize `Preview`
    },
    {
        name: EDITOR_CLOSE_TOOL,
        icon: 'icon-close',
        label: $localize `Close`
    },

    {
        name: EDITOR_ENTER_TOOL,
        icon: 'icon-enter',
        label: $localize `Link Break`,
        handler(editor) {
            editor.execute({type: EditorCommandType.AddLineBreak});
        }
    },
    // 文字处理
    {
        name: 'heading',
        icon: 'icon-heading',
        label: $localize `Heading`,
        parent: 'text',
        modal: EditorDropdownComponent,
        handler(editor, _, data) {
            editor.execute({...data, type: EditorCommandType.Heading});
        },
    },
    {
        name: 'bold',
        icon: 'icon-bold',
        label: $localize `Font Bold`,
        parent: 'text',
        handler(editor) {
            editor.execute({type: EditorCommandType.Bold});
        },
    },
    {
        name: 'italic',
        icon: 'icon-italic',
        label: $localize `Font Italic`,
        parent: 'text',
        handler(editor) {
            editor.execute({type: EditorCommandType.Italic});
        },
    },
    {
        name: 'underline',
        icon: 'icon-underline',
        label: $localize `Add Underline`,
        parent: 'text',
        handler(editor) {
            editor.execute({type: EditorCommandType.Underline});
        },
    },
    {
        name: 'wavyline',
        icon: 'icon-wavy-line',
        label: $localize `Add Wavyline`,
        parent: 'text',
        handler(editor) {
            editor.execute({type: EditorCommandType.Wavyline});
        },
    },
    {
        name: 'dashed',
        icon: 'icon-dottedunderline',
        label: $localize `Subscript and dot`,
        parent: 'text',
        handler(editor) {
            editor.execute({type: EditorCommandType.Dashed});
        },
    },
    {
        name: 'strike',
        icon: 'icon-strike',
        label: $localize `Strike Through`,
        parent: 'text',
        handler(editor) {
            editor.execute({type: EditorCommandType.Strike});
        },
    },
    {
        name: 'sub',
        icon: 'icon-sub',
        label: $localize `Sub`,
        parent: 'text',
        handler(editor) {
            editor.execute({type: EditorCommandType.Sub});
        },
    },
    {
        name: 'sup',
        icon: 'icon-sup',
        label: $localize `Sup`,
        parent: 'text',
        handler(editor) {
            editor.execute({type: EditorCommandType.Sub});
        },
    },
    {
        name: 'fontsize',
        icon: 'icon-font-size',
        label: $localize `Font Size`,
        parent: 'text',
        modal: EditorDropdownComponent,
        handler(editor, _, data) {
            editor.execute({...data, type: EditorCommandType.FontSize});
        },
    },
    {
        name: 'font',
        icon: 'icon-pencil',
        label: $localize `Font Family`,
        parent: 'text',
        modal: EditorDropdownComponent,
        handler(editor, _, data) {
            editor.execute({...data, type: EditorCommandType.FontFamily});
        },
    },
    {
        name: 'foreground',
        icon: 'icon-font-foreground',
        label: $localize `Font Color`,
        parent: 'text',
        modal: EditorColorComponent,
        handler(editor, _, data) {
            editor.execute({...data, type: EditorCommandType.Foreground});
        },
    },
    {
        name: 'background',
        icon: 'icon-editor-background-color',
        label: $localize `Background`,
        parent: 'text',
        modal: EditorColorComponent,
        handler(editor, _, data) {
            editor.execute({...data, type: EditorCommandType.Background});
        },
    },
    {
        name: 'clear',
        icon: 'icon-clearformat',
        label: $localize `Clear Style`,
        parent: 'text',
        handler(editor) {
            editor.execute({type: EditorCommandType.ClearStyle});
        },
    },

    // 段落处理
    {
        name: 'align-left',
        icon: 'icon-alignleft',
        label: $localize `Algin Left`,
        parent: 'paragraph',
        handler(editor) {
            editor.execute({type: EditorCommandType.Align, value: 'left'})
        },
    },
    {
        name: 'align-center',
        icon: 'icon-aligncenter',
        label: $localize `Algin Center`,
        parent: 'paragraph',
        handler(editor) {
            editor.execute({type: EditorCommandType.Align, value: 'center'})
        },
    },
    {
        name: 'align-right',
        icon: 'icon-alignright',
        label: $localize `Algin Right`,
        parent: 'paragraph',
        handler(editor) {
            editor.execute({type: EditorCommandType.Align, value: 'right'})
        },
    },
    {
        name: 'align-justify',
        icon: 'icon-alignjustify',
        label: $localize `Algin Justify`,
        parent: 'paragraph',
        handler(editor) {
            editor.execute({type: EditorCommandType.Align, value: ''})
        },
    },
    {
        name: 'list',
        icon: 'icon-orderedlist',
        label: $localize `As List`,
        parent: 'paragraph',
        handler(editor) {
            editor.execute({type: EditorCommandType.List});
        },
    },
    {
        name: 'indent',
        icon: 'icon-indent',
        label: $localize `Line Indent`,
        parent: 'paragraph',
        handler(editor) {
            editor.execute({type: EditorCommandType.Indent});
        },
    },
    {
        name: 'outdent',
        icon: 'icon-outdent',
        label: $localize `Line Outdent`,
        parent: 'paragraph',
        handler(editor) {
            editor.execute({type: EditorCommandType.Outdent});
        },
    },
    {
        name: 'blockquote',
        icon: 'icon-blockquote',
        label: $localize `Add Blockquote`,
        parent: 'paragraph',
        handler(editor) {
            editor.execute({type: EditorCommandType.Blockquote});
        },
    },


    // 添加
    {
        name: 'link',
        icon: 'icon-chain',
        label: $localize `Add Link`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorLinkComponent,
        handler(editor, range, data) {
            editor.execute({
                type: EditorCommandType.AddLink,
                ...data                
            }, range);
        },
    },
    {
        name: 'image',
        icon: 'icon-image',
        label: $localize `Add Image`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorImageComponent,
        handler(editor, range, data) {
            editor.execute({
                type: EditorCommandType.AddImage,
                ...data                
            }, range);
        },
    },
    {
        name: 'video',
        icon: 'icon-file-movie-o',
        label: $localize `Add Video`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorVideoComponent,
        handler(editor, range, data) {
            editor.execute({
                type: EditorCommandType.AddVideo,
                ...data                
            }, range);
        },
    },
    {
        name: 'table',
        icon: 'icon-table',
        label: $localize `Add Table`,
        parent: 'add',
        modal: EditorTableComponent,
        handler(editor, range, data) {
            editor.execute({
                type: EditorCommandType.AddTable,
                ...data                
            }, range);
        },
    },
    {
        name: 'file',
        icon: 'icon-file-o',
        label: $localize `Add File`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorFileComponent,
        handler(editor, range, data) {
            editor.execute({
                type: EditorCommandType.AddFile,
                ...data                
            }, range);
        },
    },
    {
        name: 'code',
        icon: 'icon-code',
        label: $localize `Add Code`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorCodeComponent,
        handler(editor, range, data) {
            editor.execute({
                type: EditorCommandType.AddCode,
                ...data                
            }, range);
        },
    },
    // {
    //     name: 'search',
    //     icon: 'icon-search',
    //     label: $localize `Insert Any Artcles`,
    //     parent: EDITOR_ADD_TOOL,
    //     modal: EditorSearchComponent,
    //     handler(editor, range, data) {
    //         editor.execute({
    //             type: EditorCommandType.AddData,
    //             ...data                
    //         }, range);
    //     },
    // },
    {
        name: 'line',
        icon: 'icon-minus',
        label: $localize `Add Line`,
        parent: EDITOR_ADD_TOOL,
        handler(editor) {
            editor.execute({type: EditorCommandType.AddHr});
        }
    },
    {
        name: 'map',
        icon: 'fa-map-marked',
        label: $localize `Add Map Marker`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorMapComponent,
        handler(editor, range, data) {
            editor.execute({
                type: EditorCommandType.AddFrame,
                value: assetUri('/home/map?point=' + data.value + '&marker=' + encodeURIComponent(data.mark)),        
            }, range);
        }
    },

    // 更多
    {
        name: EDITOR_FULL_SCREEN_TOOL,
        icon: 'icon-full-screen',
        label: $localize `Toggle Full Screen`,
        parent: EDITOR_MORE_TOOL,
    },
    {
        name: 'select-all',
        icon: 'icon-selectall',
        label: $localize `Select All`,
        parent: EDITOR_MORE_TOOL,
        handler(editor, range, data) {
            editor.selectAll();
        },
    },
    {
        name: EDITOR_CODE_TOOL,
        icon: 'icon-code',
        label: $localize `View Code`,
        parent: EDITOR_MORE_TOOL,
    },

    // 图片处理
    {
        name: 'replace-image',
        icon: 'icon-exchange',
        label: $localize `Replace`,
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'align-image',
        icon: 'icon-alignright',
        label: $localize `Position`,
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'caption-image',
        icon: 'icon-image',
        label: $localize `Image Title`,
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'delete-image',
        icon: 'icon-trash',
        label: $localize `Delete Image`,
        parent: EDITOR_IMAGE_TOOL, 
        handler(editor) {
            editor.execute({type: EditorCommandType.NodeRemove});
        },
    },
    {
        name: 'link-image',
        icon: 'icon-chain',
        label: $localize `Insert Link`,
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'alt-image',
        icon: 'icon-char',
        label: $localize `Image caption`,
        modal: EditorTextComponent,
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'size-image',
        icon: 'icon-ruler',
        label: $localize `Adjust size`,
        parent: EDITOR_IMAGE_TOOL, 
    },
    
    // 视频处理
    {
        name: 'replace-video',
        icon: 'icon-exchange',
        label: $localize `Replace`,
        parent: EDITOR_VIDEO_TOOL, 
    },
    {
        name: 'align-video',
        icon: 'icon-alignright',
        label: $localize `Position`,
        parent: EDITOR_VIDEO_TOOL, 
    },
    {
        name: 'caption-video',
        icon: 'icon-film',
        label: $localize `Video Title`,
        parent: EDITOR_VIDEO_TOOL, 
    },
    {
        name: 'delete-video',
        icon: 'icon-trash',
        label: $localize `Delete Video`,
        parent: EDITOR_VIDEO_TOOL, 
        handler(editor) {
            editor.execute({type: EditorCommandType.NodeRemove});
        },
    },
    {
        name: 'size-video',
        icon: 'icon-ruler',
        label: $localize `Adjust size`,
        parent: EDITOR_VIDEO_TOOL, 
    },

    // iframe
    {
        name: 'align-frame',
        icon: 'icon-alignright',
        label: $localize `Position`,
        parent: EDITOR_OVERLAY_TOOL, 
    },
    {
        name: 'delete-frame',
        icon: 'icon-trash',
        label: $localize `Delete`,
        parent: EDITOR_OVERLAY_TOOL, 
        handler(editor) {
            editor.execute({type: EditorCommandType.NodeRemove});
        },
    },
    {
        name: 'size-frame',
        icon: 'icon-ruler',
        label: $localize `Adjust size`,
        parent: EDITOR_OVERLAY_TOOL, 
    },

    // 表格处理

    {
        name: 'header-table',
        icon: 'icon-table',
        label: $localize `Table Head`,
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.execute({type: EditorCommandType.Thead});
        },
    },
    {
        name: 'footer-table',
        icon: 'icon-table',
        label: $localize `Table Foot`,
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.execute({type: EditorCommandType.TFoot});
        },
    },
    {
        name: 'delete-table',
        icon: 'icon-trash',
        label: $localize `Delete Table`,
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.execute({type: EditorCommandType.DeleteTable});
        },
    },
    {
        name: 'row-table',
        icon: 'icon-table',
        label: $localize `Row`,
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'column-table',
        icon: 'icon-table',
        label: $localize `Column`,
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'style-table',
        icon: 'icon-table',
        label: $localize `Table Style`,
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'cell-table',
        icon: 'icon-table',
        label: $localize `Cell`,
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'cell-background-table',
        icon: 'icon-table',
        label: $localize `Cell background`,
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'cell-style-table',
        icon: 'icon-table',
        label: $localize `Cell Style`,
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'horizontal-table',
        icon: 'icon-shuipingdengjianju',
        label: $localize `Horizontal merger`,
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.execute({type: EditorCommandType.ColSpan});
        },
    },
    {
        name: 'vertical-table',
        icon: 'icon-chuizhidengjianju',
        label: $localize `Vertical merger`,
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.execute({type: EditorCommandType.RowSpan});
        },
    },
    // 链接处理

    {
        name: 'open-link',
        icon: 'icon-paper-plane',
        label: $localize `Open Link`,
        parent: EDITOR_LINK_TOOL, 
        handler(editor) {
            editor.execute({type: EditorCommandType.OpenLink});
        },
    },
    {
        name: 'link-style',
        icon: 'icon-font-foreground',
        label: $localize `Change Style`,
        parent: EDITOR_LINK_TOOL, 
    },
    {
        name: 'edit-link',
        icon: 'icon-edit',
        label: $localize `Edit Link`,
        parent: EDITOR_LINK_TOOL, 
    },
    {
        name: 'unlink',
        icon: 'icon-chain-broken',
        label: $localize `Disconnect`,
        parent: EDITOR_LINK_TOOL, 
    },
];