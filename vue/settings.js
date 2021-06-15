import _ from 'lodash'

import typesUtils from 'src/utils/types'

class FacebookSettings {
    constructor(appData) {
        const facebookWebclientData = typesUtils.pObject(appData.Facebook)
        if (!_.isEmpty(facebookWebclientData)) {
            this.displayName = facebookWebclientData.DisplayName
            this.enableModule = facebookWebclientData.EnableModule
            this.id = facebookWebclientData.Id
            this.name = facebookWebclientData.Name
            this.scopes = facebookWebclientData.Scopes
            this.secret = facebookWebclientData.Secret
        }
    }
    
    saveFacebookSettings({ EnableModule, Id, Scopes, Secret}) {
        this.enableModule = EnableModule
        this.id = Id
        this.scopes = Scopes
        this.secret = Secret
    }
}

let settings = null

export default {
    init (appData) {
        settings = new FacebookSettings(appData)
    },
    saveFacebookSettings(data) {
        settings.saveFacebookSettings(data)
    },
    getFacebookSettings () {
        return {
            DisplayName: settings.displayName,
            EnableModule: settings.enableModule,
            Id: settings.id,
            Name: settings.name,
            Scopes: settings.scopes,
            Secret: settings.secret
        }
    },
}
