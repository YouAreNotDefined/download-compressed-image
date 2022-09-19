<template>
  <v-app>
    <v-container
      class="v-application px-0"
      fluid
    >
      <h1 class="h1 pa-4">Configuration</h1>
      <div class="flex justify-space-between pa-3">
        <h2 class="h2">RESIZE</h2>
        <v-switch v-model="config.resize.enabled" />
      </div>
      <div v-show="config.resize.enabled" class="mb-4">
        <v-select v-model="config.resize.method" class="mb-3" :items="methodList" label="Method" />
        <v-text-field v-model="config.resize.width" class="mb-3" label="Width" outlined />
        <v-text-field v-model="config.resize.height" class="mb-3" label="Height" outlined />
        <v-checkbox v-model="config.resize.premultiply" class="mb-3" label="Premultiply alpha channel" />
        <v-checkbox v-model="config.resize.linearRGB" class="mb-3" label="Linear RGB" />
      </div>
      <h2 class="h2 mb-4">COMPRESS</h2>
      <v-select v-model="config.format" class="mb-3" :items="formatList" label="Format" />
      <v-slider v-model="config.quality" class="mb-4" label="Quality" thumb-label="always" max="100" min="0" />
      <v-btn
        class="text-center"
        color="primary"
        elevation="2"
        :loading="saving"
        @click="saveConfig"
      >
        Save
      </v-btn>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { VBtn, VApp, VContainer, VSwitch, VSelect, VCheckbox, VTextField, VSlider } from 'vuetify/lib'
import { defaultConfig, Method, Format } from '../type/type'

@Component({
  components: {
    VBtn, VApp, VContainer, VSwitch, VSelect, VCheckbox, VTextField, VSlider
  },
})

export default class App extends Vue {
  config = defaultConfig
  readonly methodList = Object.values(Method)
  readonly formatList = Object.values(Format)
  saving = false

  saveConfig() {
    this.saving = true
    chrome.storage.local.set({'config': JSON.stringify(this.config)}, () => {
      this.saving = false
    })
  }
}
</script>
