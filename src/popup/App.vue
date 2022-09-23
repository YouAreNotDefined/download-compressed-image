<template>
  <v-app>
    <v-container
      class="v-application px-0"
      fluid
    >
      <h1 class="h1 pa-4">Configuration</h1>
      <div class="flex justify-space-between pa-3">
        <h2 class="h2 mb-3">RESIZE</h2>
        <v-select
          v-model="options.resize"
          :rules="rules.resize"
          required
          class="mb-3"
          :items="resizeList"
          label="Resize Format"
        />
      </div>
      <v-text-field v-model="options.width" :rules="rules.number" required class="mb-3" label="Width" outlined />
      <v-text-field v-model="options.height" :rules="rules.number" required class="mb-4" label="Height" outlined />
      <h2 class="h2 mb-4">COMPRESS</h2>
      <v-select
        v-model="options.mimeType"
        :rules="rules.mime"
        required
        class="mb-3"
        :items="mimeList"
        label="Output Format"
      />
      <v-slider
        v-model="quality"
        class="mb-4"
        label="Quality"
        thumb-label="always"
        max="100"
        min="0"
        required
      />
      <v-text-field
        v-model="options.maxWidth"
        :rules="rules.number"
        required
        class="mb-3"
        label="Output Image Max Width"
        outlined
      />
      <v-text-field
        v-model="options.maxHeight"
        :rules="rules.number"
        required
        class="mb-3"
        label="Output Image Max Height"
        outlined
      />
      <v-alert v-show="!isValidated" class="mb-3" type="error">There is an incorrect entry</v-alert>
      <v-btn
        class="text-center"
        color="primary"
        elevation="2"
        :loading="saving"
        @click="saveOptions"
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
import { defaultOptions } from "../common"

@Component({
  components: {
    VBtn, VApp, VContainer, VSwitch, VSelect, VCheckbox, VTextField, VSlider
  },
})

export default class App extends Vue {
  options = defaultOptions
  readonly resizeList = ['auto', 'contain', 'cover']
  readonly mimeList = ['auto', 'image/jpeg', 'image/png', 'image/webp']
  saving = false
  rules = {
    number: [
      (v: any) => !!v || 'This is required',
      (v: any) => isNaN(v) || 'This must be Number',
    ],
    resize: [
      (v: any) => !!v || 'This is required',
      (v: any) => this.resizeList.includes(v) || 'Incorrect choice',
    ],
    mime: [
      (v: any) => !!v || 'This is required',
      (v: any) => this.mimeList.includes(v) || 'Incorrect choice',
    ],
  }
  isValidated = true

  public get quality(): number {
    if (this.options.quality === undefined) return 70
    return this.options.quality * 10
  }
  public set quality(v: number) {
    this.options.quality = v / 10
  }

  saveOptions() {
    this.isValidated = Object.values(this.rules).every(v => v)
    if(!this.isValidated) return
    this.saving = true
    chrome.storage.local.set({'options': JSON.stringify(this.options)}, () => {
      this.saving = false
    })
  }
}
</script>
