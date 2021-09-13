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
            tag="div"
          >
            <list-item
              v-for="item in files"
              :key="item.file.path"
              class="py-1 px-4"
              :item="item"
            />
          </transition-group>
        </div>
      </div>
    </file-dropzone>
  </div>
</template>

<script>
import FileDropzone from '@/components/util/FileDropzone.vue';
import IconPhotograph from '@/components/icons/IconPhotograph.vue';
import ListItem from '@/components/files/ListItem';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import path from 'path';

export default {
  name: 'App',
  components: {
    ListItem,
    IconPhotograph,
    FileDropzone,
  },
  data: () => ({
    files: [],
    queue: [],
  }),
  mounted() {
    setInterval(() => {
      if (this.queue.length === 0) {
        return;
      }

      const item = this.queue.shift();

      this.optimizeImage(item);
    }, 1000 / 3);
  },
  methods: {
    onChangeFileInput(event) {
      this.addFiles(event?.target?.queue);
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
      this.queue.push(...addableFiles);
    },

    async optimizeImage(item) {
      item.status = 1;

      const filePath = item.file.path
        .replace(/\\/g, '/')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');

      await imagemin([filePath], {
        destination: path.dirname(item.file.path),
        plugins: [
          //jpg
          imageminJpegtran({
            progressive: true,
          }),
          imageminMozjpeg(),
          //png
          imageminOptipng(),
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
          //gif
          imageminGifsicle(),
          //svg
          imageminSvgo(),
        ],
      }).then(([{ data }]) => {
        item.status = 2;
        item.size = data.toString().length;
      });

      this.queue = this.queue.filter(i => i.file.path !== item.file.path);
    },
  },
};
</script>
