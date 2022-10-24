<template>
  <v-app style="width: 400px">
    <v-container
      class="v-application px-0"
      fluid
    >
      <v-row>
        <v-col class="pa-8">
          <v-form v-model="isValidated">
            <h1 class="h1 mb-3">Configuration</h1>
            <v-select
              v-model="options.resize"
              :rules="rules.resize"
              required
              class="mb-2"
              :items="resizeList"
              label="Resize Format"
              persistent-hint
            />
            <v-text-field
              v-model="options.width"
              class="mb-2"
              label="Width of the output image"
              outlined
              type="number"
              persistent-hint
              hint="If the Height option is set, the Width will be computed automatically"
            />
            <v-text-field
              v-model="options.height"
              class="mb-2"
              label="Height of the output image"
              outlined
              type="number"
              persistent-hint
              hint="If the Width option is set, the Height will be computed automatically"
            />
            <h2 class="h2 mb-2">COMPRESS</h2>
            <v-select
              v-model="options.mimeType"
              :rules="rules.mime"
              required
              class="mb-2"
              :items="mimeList"
              label="Output Format"
            />
            <v-slider
              v-model="quality"
              class="mb-2"
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
              class="mb-2"
              label="Output Image Max Width"
              outlined
              type="number"
            />
            <v-text-field
              v-model="options.maxHeight"
              :rules="rules.number"
              required
              class="mb-2"
              label="Output Image Max Height"
              outlined
              type="number"
            />
            <v-alert v-show="!isValidated" class="mb-3" type="error">There is an incorrect entry</v-alert>
            <div class="text-center">
              <v-btn
                color="primary"
                elevation="2"
                :loading="saving"
                :disabled="!isValidated || saving"
                @click="saveOptions"
              >
                SAVE
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { VBtn, VApp, VContainer, VSwitch, VSelect, VCheckbox, VTextField, VSlider } from 'vuetify/lib'

@Component({
  components: {
    VBtn, VApp, VContainer, VSwitch, VSelect, VCheckbox, VTextField, VSlider
  },
})

export default class App extends Vue {
  options: Compressor.Options = {}
  readonly resizeList = ['none', 'contain', 'cover']
  readonly mimeList = ['auto', 'image/jpeg', 'image/png', 'image/webp']
  saving = false
  rules = {
    number: [
      (v: any) => !!v || 'This is required',
      (v: any) => !isNaN(parseInt(v)) || 'This must be Number',
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
  isValidated = false

  public get quality(): number {
    if (this.options.quality === undefined) return 70
    return this.options.quality * 100
  }
  public set quality(v: number) {
    this.options.quality = v / 100
  }

  public mounted() {
    chrome.storage.local.get('options', value => {
      this.options = JSON.parse(value.options)
    })
  }

  saveOptions() {
    if(!this.isValidated) return
    this.saving = true
    chrome.storage.local.set({'options': JSON.stringify(this.options)}, () => {
      setTimeout(() => {
        this.saving = false
      }, 1000)
    })
  }
}
</script>
