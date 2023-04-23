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
            <v-text-field
              v-model="options.Width"
              class="mb-2"
              label="Width of the output image"
              outlined
              type="number"
            />
            <v-text-field
              v-model="options.Height"
              class="mb-2"
              label="Height of the output image"
              outlined
              type="number"
            />
            <v-select
              v-model="options.Type"
              :rules="rules.type"
              required
              class="mb-2"
              :items="typeList"
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
import { VBtn, VApp, VContainer, VSelect, VTextField, VSlider } from 'vuetify/lib'
import { defaultOptions, ImageType } from '../common';

@Component({
  components: {
    VBtn, VApp, VContainer, VSelect, VTextField, VSlider
  },
})

export default class App extends Vue {
  options = defaultOptions
  readonly typeList = Object.keys(ImageType)
  saving = false
  rules = {
    number: [
      (v: number) => !!v || 'This is required',
      (v: number) => !isNaN(v) || 'This must be Number',
    ],
    type: [
      (v: string) => !!v || 'This is required',
      (v: string) => this.typeList.includes(v) || 'Incorrect choice',
    ],
  }
  isValidated = false

  public get quality(): number {
    if (this.options.Quality == null) return 70
    return this.options.Quality * 100
  }
  public set quality(v: number) {
    this.options.Quality = v / 100
  }

  saveOptions() {
    if(!this.isValidated) return
    this.saving = true
    chrome.storage.local.set({ 'options': JSON.stringify(this.options) }, () => {
      setTimeout(() => {
        this.saving = false
      }, 500)
    })
  }
}
</script>
