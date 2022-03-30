<template>
  <prism-editor v-model="yaml" :highlight="highlighter"></prism-editor>
</template>

<script>
import yaml from 'js-yaml';

import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

function yamlIze(jstruct) {
  return yaml.dump(jstruct);
}

export default {
  name: 'Yaml',
  components: {
    PrismEditor,
  },
  props: {
    json: {
      type: Object,
      required: true,
    },
  },
  computed: {
    yaml() {
      return yamlIze(this.json);
    },
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.yaml); // languages.<insert language> to return html with markup
    },
  },
};
</script>

<style>
</style>