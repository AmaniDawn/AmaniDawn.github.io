import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://valaxy.site/',
  lang: 'zh-CN',
  title: "Amani's Blog",
  author: {
    name: 'Amani',
    avatar: '/images/avatar.png',
  },
  description: 'Valaxy Theme Yun Preview.',
  social: [
    {
      name: 'QQ',
      link: 'https://res.abeim.cn/api/qq/?qq=799375868',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/AmaniDawn',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/702532206',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: '微信',
      link: '/images/qrcode.jpg',
      icon: 'i-ri-wechat-2-line',
      color: '#1AAD19',
    },
    {
      name: 'E-Mail',
      link: 'mailto:799375868@qq.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  search: {
    enable: false,
  },

  comment: {
    enable: false,
  },

  sponsor: {
    enable: true,
    title: '我很可爱，请给我钱！',
    methods: [
      {
        name: '赞赏',
        url: '/images/Sponsor.jpg',
        color: '#FF6B6B',
        icon: 'i-ri-heart-line',
      },
    ],
  },
})
