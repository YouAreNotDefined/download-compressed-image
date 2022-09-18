<template>
  <v-container
    class="px-0"
    fluid
  >
    <h1 class="h1 pa-4">Configuration</h1>
    <div class="flex justify-space-between pa-3">
      <h2 class="h2">RESIZE</h2>
      <v-switch v-model="resize.enabled" />
    </div>
    <div v-show="resize.enabled" class="mb-4">
      <v-select v-model="resize.method" class="mb-3" :items="methodList" label="Method" />
      <v-text-field v-model="resize.width" class="mb-3" label="Width" outlined />
      <v-text-field v-model="resize.height" class="mb-3" label="Height" outlined />
      <v-checkbox v-model="resize.premultiply" class="mb-3" label="Premultiply alpha channel" />
      <v-checkbox v-model="resize.linearRGB" class="mb-3" label="Linear RGB" />
    </div>
    <h2 class="h2 mb-4">COMPRESS</h2>
    <v-select v-model="resize.format" class="mb-3" :items="formatList" label="Format" />
    <v-slider v-model="rezize.quality" class="mb-4" lable="Quality" thumb-label="always" max="100" min="0" />
    <v-btn class="text-center" color="primary" elevation="2" @click="sendConfig">Done</v-btn>
  </v-container>
</template>

<script lang="ts">
import { Config, Method, Format } from '../type/type'

export default {
  name: 'App',
  data() {
    return {
      config: {
        resize: {
          enabled: false,
          width: 640,
          height: 640,
          premultiply:true,
          linearRGB: true,
          method: 'lanczos3'
        },
        quality: 75,
        format: 'mozjpeg',
      } as Config,
      methodList: Object.values(Method),
      formatList: Object.values(Format),
    }
  },
  methods: {
    sendConfig() {
      chrome.runtime.sendMessage(JSON.stringify(this.config))
    },
  },
}
</script>
