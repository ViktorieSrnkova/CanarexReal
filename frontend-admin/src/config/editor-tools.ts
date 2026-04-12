import EditorJS, { type BlockToolConstructable } from "@editorjs/editorjs";

import Header from "editorjs-header-with-alignment";
import ImageTool from "@editorjs/image";
import ImageTunePlus from "editorjs-image-tune-plus";
import Paragraph from "editorjs-paragraph-with-alignment";

import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import ImageGallery from "@rodrigoodhin/editorjs-image-gallery";

import Multicolumn from "editorjs-multicolumn";
import Underline from "@editorjs/underline";
import ToggleBlock from "editorjs-toggle-block";
import EmojiPickerTool from "@plebjs/editorjs-emoji-picker-tool";
import FontSize from "@fillipeppalhares/editorjs-font-size";

import { uploadImage } from "../api/image-upload";

export const fullEditorTools = {
  header: Header,

  image: {
    class: ImageTool,
    tunes: ["imageTunePlus"],
    config: {
      uploader: {
        uploadByFile: uploadImage,
      },
    },
  },

  imageTunePlus: {
    class: ImageTunePlus,
  },

  paragraph: {
    class: Paragraph as BlockToolConstructable,
    inlineToolbar: true,
  },

  imageGallery: ImageGallery,
  list: List,
  quote: Quote,
  delimiter: Delimiter,
  underline: Underline,
  fontSize: FontSize,

  toggle: {
    class: ToggleBlock,
    inlineToolbar: true,
  },

  emoji: {
    class: EmojiPickerTool,
  },

  multicolumn: {
    class: Multicolumn,
    config: {
      editorLibrary: EditorJS,
      editorTools: {},
    },
  },
};
