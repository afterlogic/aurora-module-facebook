import settings from '../../Facebook/vue/settings'

export default {
  name: 'FacebookWebclient',
  init (appData) {
    settings.init(appData)
  },
  getAdminSystemTabs () {
    return [
      {
        name: 'facebook',
        title: 'FACEBOOK.LABEL_SETTINGS_TAB',
        component () {
          return import('src/../../../Facebook/vue/components/FacebookAdminSettings')
        },
      },
    ]
  },
}
