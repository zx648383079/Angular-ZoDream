import { EDITOR_CLOSE_TOOL } from './event';
import { IEditorModule } from './option';

export const EditorModules: IEditorModule[] = [
    {
        name: 'text',
        icon: 'icon-char',
        label: '编辑文字',
    },
    {
        name: 'paragraph',
        icon: 'icon-paragraph',
        label: '编辑段落',
    },
    {
        name: 'add',
        icon: 'icon-plus',
        label: '添加内容',
    },
    {
        name: 'undo',
        icon: 'icon-undo',
        label: '撤回',
        hotKey: 'Ctrl+Z',
    },
    {
        name: 'redo',
        icon: 'icon-redo',
        label: '重做',
        hotKey: 'Ctrl+Shift+Z',
    },
    {
        name: 'more',
        icon: 'icon-ellipsis-v',
        label: '更多'
    },
    {
        name: EDITOR_CLOSE_TOOL,
        icon: 'icon-close',
        label: '关闭'
    },
    // 文字处理
    {
        name: 'bold',
        icon: 'icon-bold',
        label: '加粗',
        parent: 'text',
    },
    {
        name: 'italic',
        icon: 'icon-italic',
        label: '倾斜',
        parent: 'text',
    },
    {
        name: 'underline',
        icon: 'icon-underline',
        label: '下划线',
        parent: 'text',
    },
    {
        name: 'strike',
        icon: 'icon-strike',
        label: '画线',
        parent: 'text',
    },
    {
        name: 'sub',
        icon: 'icon-sub',
        label: '下标',
        parent: 'text',
    },
    {
        name: 'sup',
        icon: 'icon-sup',
        label: '上标',
        parent: 'text',
    },
    {
        name: 'clear',
        icon: 'icon-clearformat',
        label: '清除样式',
        parent: 'text',
    },

    // 段落处理
    {
        name: 'align-left',
        icon: 'icon-alignleft',
        label: '居左',
        parent: 'paragraph',
    },
    {
        name: 'align-center',
        icon: 'icon-aligncenter',
        label: '居中',
        parent: 'paragraph',
    },
    {
        name: 'align-right',
        icon: 'icon-alignright',
        label: '居右',
        parent: 'paragraph',
    },
    {
        name: 'align-justify',
        icon: 'icon-alignjustify',
        label: '铺满',
        parent: 'paragraph',
    },
    {
        name: 'indent',
        icon: 'icon-indent',
        label: '缩进',
        parent: 'paragraph',
    },
    {
        name: 'outdent',
        icon: 'icon-outdent',
        label: '取消缩进',
        parent: 'paragraph',
    },
    {
        name: 'blockquote',
        icon: 'icon-blockquote',
        label: '添加引用',
        parent: 'paragraph',
    },

    // 添加
    {
        name: 'link',
        icon: 'icon-chain',
        label: '添加链接',
        parent: 'add',
    },
    {
        name: 'image',
        icon: 'icon-image',
        label: '添加图片',
        parent: 'add',
    },
    {
        name: 'video',
        icon: 'icon-file-movie-o',
        label: '添加视频',
        parent: 'add',
    },
    {
        name: 'table',
        icon: 'icon-table',
        label: '添加表格',
        parent: 'add',
    },
    {
        name: 'file',
        icon: 'icon-file-o',
        label: '添加文件',
        parent: 'add',
    },
    {
        name: 'line',
        icon: 'icon-minus',
        label: '添加横线',
        parent: 'add',
    },

    // 更多
    {
        name: 'full-screen',
        icon: 'icon-full-screen',
        label: '全屏',
        parent: 'more',
    },
    {
        name: 'select-all',
        icon: 'icon-selectall',
        label: '全选',
        parent: 'more',
    },
    {
        name: 'code',
        icon: 'icon-code',
        label: '查看代码',
        parent: 'more',
    }
];