import { MenuReadyFn } from '../../../backend/menu.service';

export const DiskBackendMenu: MenuReadyFn = function() {
    return [
        {
            name: '网盘管理',
            url: this.renderUrl(''),
            icon: 'icon-cloud',
            role: 'disk_manage',
            children: [
                {
                    name: '文件列表',
                    url: this.renderUrl('files'),
                },
                {
                    name: '存储服务器',
                    url: this.renderUrl('servers'),
                },
                {
                    name: '存储客户端',
                    url: this.renderUrl('client'),
                },
            ]
        }
    ];
};