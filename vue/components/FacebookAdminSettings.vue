<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg" style="min-width: 800px">
      <div class="row q-mb-md">
        <div class="col text-h5">{{ $t('GOOGLE.HEADING_SETTINGS') }}</div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row">
            <q-item>
              <q-item-section>
                <q-checkbox v-model="enableFacebook" color="teal">
                  <q-item-label caption>{{ $t('FACEBOOK.ENABLE_MODULE') }}</q-item-label>
                </q-checkbox>
              </q-item-section>
            </q-item>
          </div>
          <div class="row q-mb-md q-ml-md">
            <div class="col-1 q-my-sm q-ml-md required-field" v-t="'OAUTHINTEGRATORWEBCLIENT.LABEL_APP_ID'"></div>
            <div class="col-5 q-ml-xl">
              <q-input outlined dense class="bg-white" v-model="appId"/>
            </div>
          </div>
          <div class="row q-mb-md q-ml-md">
            <div class="col-1 q-my-sm q-ml-md required-field" v-t="'OAUTHINTEGRATORWEBCLIENT.LABEL_APP_SECRET'"></div>
            <div class="col-5 q-ml-xl">
              <q-input outlined dense class="bg-white" v-model="appSecret"/>
            </div>
          </div>
          <div class="row q-ml-md">
            <q-item-label caption>
              <span class="q-ml-sm">{{ $t('FACEBOOK.INFO_SETTINGS') }}</span>
            </q-item-label>
          </div>
          <div class="row">
            <q-item>
              <q-item-section>
                <q-checkbox v-model="auth" color="teal">
                  <q-item-label caption>{{ $t('FACEBOOKAUTHWEBCLIENT.SCOPE_AUTH') }}</q-item-label>
                </q-checkbox>
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="saveFacebookSettings"
               :label="saving ? $t('COREWEBCLIENT.ACTION_SAVE_IN_PROGRESS') : $t('COREWEBCLIENT.ACTION_SAVE')">
        </q-btn>
      </div>
    </div>
    <UnsavedChangesDialog ref="unsavedChangesDialog"/>
  </q-scroll-area>
</template>

<script>
import UnsavedChangesDialog from 'src/components/UnsavedChangesDialog'
import settings from '../../../Facebook/vue/settings'
import webApi from 'src/utils/web-api'
import notification from 'src/utils/notification'
import errors from 'src/utils/errors'
import _ from 'lodash';

export default {
  name: 'FacebookAdminSettings',
  components: {
    UnsavedChangesDialog
  },
  data () {
    return {
      saving: false,
      enableFacebook: false,
      auth: false,
      appId: '',
      appSecret: '',
      scopes: []
    }
  },
  mounted () {
    this.populate()
  },
  beforeRouteLeave (to, from, next) {
    if (this.hasChanges() && _.isFunction(this?.$refs?.unsavedChangesDialog?.openConfirmDiscardChangesDialog)) {
      this.$refs.unsavedChangesDialog.openConfirmDiscardChangesDialog(next)
    } else {
      next()
    }
  },
  methods: {
    hasChanges () {
      const data = settings.getFacebookSettings()
      let hasChangesScopes = false
      this.scopes.forEach((scope) => {
        if (!hasChangesScopes) {
          if (scope.Name === 'auth') {
            hasChangesScopes = this.auth !== scope.Value
          }
        }
      })
      return this.enableFacebook !== data.EnableModule ||
          this.appId !== data.Id ||
          hasChangesScopes ||
          this.appSecret !== data.Secret
    },
    populate () {
      const data = settings.getFacebookSettings()
      this.enableFacebook = data.EnableModule
      this.appId = data.Id
      this.scopes = data.Scopes
      this.appSecret = data.Secret
      this.scopes.forEach((scope) => {
        if (scope.Name === 'auth') {
          this.auth = scope.Value
        }
      })
    },
    saveFacebookSettings () {
      if (this.appId && this.appSecret) {
        this.save()
      } else {
        notification.showError(this.$t('MAILWEBCLIENT.ERROR_REQUIRED_FIELDS_EMPTY'))
      }
    },
    save () {
      if (!this.saving) {
        this.saving = true
        this.scopes.forEach((scope) => {
          if (scope.Name === 'auth') {
            scope.Value = this.auth
          }
        })
        const parameters = {
          EnableModule: this.enableFacebook,
          Id: this.appId,
          Secret: this.appSecret,
          Scopes: this.scopes
        }
        webApi.sendRequest({
          moduleName: 'Facebook',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            settings.saveFacebookSettings(parameters)
            this.populate()
            notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
          }
        }, response => {
          this.saving = false
          notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
