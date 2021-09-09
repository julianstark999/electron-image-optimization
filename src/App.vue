<template>
  <div
    class="flex overflow-hidden flex-col min-h-screen font-sans antialiased bg-white"
  >
    <file-dropzone @filesDropped="onFilesDropped">
      <div class="flex flex-col w-full">
        <div class="flex overflow-y-auto flex-col flex-grow h-0">
          <label
            v-show="!files.length"
            class="flex flex-col justify-center items-center p-4 h-full text-gray-500 hover:text-indigo-700 hover:underline cursor-pointer"
          >
            <icon-photograph class="w-24 h-24" />
            <span class="text-lg"
              >Dateien hier ablegen oder klicken um Dateien hinzuzufügen</span
            >
            <input
              type="file"
              class="hidden"
              multiple
              @change="onChangeFileInput"
            />
          </label>
          <transition-group
            enter-class="transition-opacity duration-100"
            enter-active-class="opacity-0"
            enter-to-class="opacity-100"
            leave-class="transition-opacity duration-150"
            leave-active-class="opacity-100"
            leave-to-class="opacity-0"
            class="flex-1 space-y-1 divide-y"
            tag="ul"
          >
            <li
              v-for="(item, index) in files"
              :key="item.file.path"
              class="flex items-center py-1 px-4 space-x-4"
            >
              <list-item :item="item" />
              <div class="flex-shrink-0">
                <button
                  v-show="item.status === 0"
                  type="button"
                  class="inline-flex items-center p-0.5 text-white bg-red-600 hover:bg-red-700 disabled:hover:bg-red-600 rounded-full border border-transparent shadow-sm disabled:opacity-75 disabled:cursor-wait focus:outline-none"
                  @click="removeFile(index)"
                  :disabled="isInProgress"
                >
                  <icon-close class="w-4 h-4" />
                </button>
                <badge v-show="item.status === 1" class="bg-yellow-600">
                  <icon-spin class="w-4 h-4 animate-spin" />
                </badge>
                <badge v-show="item.status === 2" class="bg-green-600">
                  <icon-check class="w-4 h-4" />
                </badge>
              </div>
            </li>
          </transition-group>
        </div>
        <div class="flex flex-col flex-shrink-0 py-2 px-4 border-t">
          <div class="flex justify-between items-center">
            <button
              type="button"
              class="inline-flex items-center py-1.5 px-2.5 space-x-2 text-xs font-medium text-white rounded border border-transparent shadow-sm disabled:opacity-75 focus:outline-none select-none"
              :class="{
                'disabled:cursor-wait': isInProgress,
                'bg-green-600 hover:bg-green-700 disabled:hover:bg-green-600': !isInProgress,
                'bg-yellow-600 hover:bg-yellow-700 disabled:hover:bg-yellow-600': isInProgress,
              }"
              @click="startOptimization"
              :disabled="!optimizableFiles.length || isInProgress"
            >
              <icon-spin v-if="isInProgress" class="w-4 h-4 animate-spin" />
              <span v-show="!isInProgress">Konvertierung starten</span>
              <span v-show="isInProgress">Konvertieren läuft</span>
            </button>

            <div class="text-lg font-medium text-gray-800">
              <span
                >{{ files.length }} Dateien mit
                {{ fileSizeSum | fileSize }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </file-dropzone>
  </div>
</template>

<script>
import FileDropzone from './components/FileDropzone.vue';
import { sumBy } from 'lodash';
import {
  createTmpDir,
  openDir,
  optimizeFiles,
} from './helpers/OptimizationHelper';
import IconPhotograph from './components/icons/IconPhotograph.vue';
import IconSpin from './components/icons/IconSpin.vue';
import IconClose from './components/icons/IconClose.vue';
import ListItem from '@/components/files/ListItem';
import fileSize from '@/filters/fileSize';
import IconCheck from '@/components/icons/IconCheck';
import Badge from '@/components/util/Badge';

export default {
  name: 'App',
  components: {
    Badge,
    IconCheck,
    ListItem,
    IconClose,
    IconSpin,
    IconPhotograph,
    FileDropzone,
  },
  data: () => ({
    isInProgress: false,
    files: [],
  }),
  computed: {
    fileSizeSum() {
      return sumBy(this.files, i => i.file.size);
    },
    optimizableFiles() {
      return this.files.filter(f => f.status === 0);
    },
  },
  filters: { fileSize },
  methods: {
    onChangeFileInput(event) {
      this.addFiles(event?.target?.files);
    },
    onFilesDropped(files) {
      this.addFiles(files);
    },

    canAddFile(file) {
      return (
        !this.files.some(({ file: { path } }) => path === file.path) &&
        !!file.path.toLowerCase().match(/.(jpg|jpeg|png|svg|gif)/)
      );
    },
    addFiles(files) {
      const addableFiles = Array.from(files)
        .filter(f => this.canAddFile(f))
        .map(file => ({
          file: file,
          status: 0,
        }));

      this.files.push(...addableFiles);
    },
    removeFile(index) {
      this.files.splice(index, 1);
    },

    async startOptimization() {
      if (this.isInProgress) {
        return;
      }

      this.isInProgress = true;

      const tmpDir = createTmpDir();

      await Promise.all(
        this.optimizableFiles.map(async i => {
          i.status = 1;
          await optimizeFiles(i.file, tmpDir).then(() => {
            i.status = 2;
          });
        })
      );

      await openDir(tmpDir);

      this.isInProgress = false;
    },
  },
};
</script>
