import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonAlgolia } from 'valaxy-addon-algolia'
import { addonWaline } from 'valaxy-addon-waline'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  // Algolia Search Configuration
  // 申请地址: https://docsearch.algolia.com/
  addons: [
    addonAlgolia({
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
    }),
    addonWaline({
      serverURL: 'https://amani-blog-waline-ohlwhca9t-azurebubbles-projects.vercel.app',
    }),
  ],

  themeConfig: {
    avatar: {
      url: '/images/avatar.png',
      rounded: true,
    },
    banner: {
      enable: true,
      title: 'Amani的博客',
    },


    footer: {
      since: 2016,
      beian: {
        enable: true,
        icp: '苏ICP备17038157号',
        police: '苏公网安备xxxxxx号',
      },
    },
  },

  unocss: { safelist },
})
