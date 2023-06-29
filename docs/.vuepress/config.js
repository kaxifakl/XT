module.exports = {
    title: 'XT',
    base:"/file-store/XT-doc/",
    description: 'Just playing around',
    themeConfig: {
        nav: [
            { text: 'Github', link: "https://github.com/kaxifakl/XT" }
        ],
        sidebar: [
            {
                title: '简介',
                collapsable: false,
                sidebarDepth: 0,
                children: [
                    "/",
                    ['/start/install', '安装'],
                    ['/start/content', '目录结构']
                ],
            },
            {
                title: '模块',
                collapsable: false,
                sidebarDepth: 0,
                children: [
                    ['/page/global', '全局注入']
                ]
            }
        ]
    }
}