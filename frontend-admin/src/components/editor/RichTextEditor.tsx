import {
  useEditor,
  EditorContent,
  type JSONContent,
  useEditorState,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Placeholder from "@tiptap/extension-placeholder";
import Blockquote from "@tiptap/extension-blockquote";
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BgColorsOutlined,
  BoldOutlined,
  CaretDownFilled,
  CheckSquareOutlined,
  FontColorsOutlined,
  ItalicOutlined,
  LineOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  SmileOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Document from "@tiptap/extension-document";
import { TableKit } from "@tiptap/extension-table";
import { Gapcursor } from "@tiptap/extensions";
import {
  Details,
  DetailsContent,
  DetailsSummary,
} from "@tiptap/extension-details";
import Image from "@tiptap/extension-image";
import { ListKit, TaskItem, TaskList } from "@tiptap/extension-list";
import "./richtexteditor.css";
import {
  getCurrentBlockType,
  getCurrentLineHeight,
  getTableHeaderState,
  type HeadingLevel,
} from "./EditorHelpers";
import TableToolbar from "./TableToolbar";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import EmojiPicker from "emoji-picker-react";
import FileHandler from "@tiptap/extension-file-handler";
import { useState, useRef, useEffect } from "react";
import { getContrastColor } from "../../utils/getContrastColor";
import { uploadMedia } from "../../services/mediaService";

Emoji.configure({
  emojis: gitHubEmojis,
});

type RichTextEditorProps = {
  version: "normal" | "full";
  content?: JSONContent;
  onChange?: (content: JSONContent) => void;
};

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      mediaId: {
        default: null,
        parseHTML: (element) => {
          const value = element.getAttribute("data-media-id");

          return value ? Number(value) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.mediaId) {
            return {};
          }

          return {
            "data-media-id": attributes.mediaId,
          };
        },
      },
    };
  },
});

export default function RichTextEditor({
  version,
  content,
  onChange,
}: RichTextEditorProps) {
  const isFull = version === "full";

  const editor = useEditor({
    extensions: [
      Superscript,
      Placeholder.configure({
        includeChildren: true,
        placeholder: "Začněte psát sem...",
      }),
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
      TextAlign.configure({ types: ["paragraph", "heading", "listItem"] }),
      ...(isFull
        ? [
            TextStyleKit.configure({
              fontFamily: false,
            }),
            ListKit.configure({
              bulletList: false,
              orderedList: false,
              listItem: {
                HTMLAttributes: { class: "list-item" },
              },
            }),
            Details.configure({
              persist: true,
              HTMLAttributes: {
                class: "details",
              },
              renderToggleButton: ({ element, isOpen, node }) => {
                element.setAttribute(
                  "aria-label",
                  isOpen
                    ? `Collapse details: ${node.textContent || "details"}`
                    : `Expand details: ${node.textContent || "details"}`,
                );
              },
            }),
            DetailsSummary,
            Document,
            TableKit.configure({
              table: {
                resizable: true,
              },
            }),

            Gapcursor,
            DetailsContent,
            Blockquote,
            CustomImage.configure({
              resize: {
                enabled: true,
                directions: ["top", "bottom", "left", "right"],
                minWidth: 50,
                minHeight: 50,
                alwaysPreserveAspectRatio: true,
              },
              inline: true,
            }),
            TaskList,
            TaskItem.configure({
              nested: true,
            }),
            Emoji.configure({
              emojis: gitHubEmojis,
              enableEmoticons: true,
              HTMLAttributes: {
                class: "my-custom-class",
              },
            }),
            // eslint-disable-next-line react-hooks/refs
            FileHandler.configure({
              allowedMimeTypes: [
                "image/png",
                "image/jpeg",
                "image/gif",
                "image/webp",
              ],

              onDrop: (currentEditor, files, pos) => {
                files.forEach((file) => {
                  void insertImageFile(currentEditor, file, pos);
                });
              },
            }),
          ]
        : []),
    ],
    editorProps: {
      handlePaste: (_view, event) => {
        const html = event.clipboardData?.getData("text/html") ?? "";

        if (html.includes("<img")) {
          return true;
        }

        const files = event.clipboardData?.files;

        if (
          files &&
          Array.from(files).some((file) => file.type.startsWith("image/"))
        ) {
          return true;
        }

        return false;
      },
    },
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor || !content) return;

    const currentContent = editor.getJSON();

    if (JSON.stringify(currentContent) === JSON.stringify(content)) {
      return;
    }

    editor.commands.setContent(content, {
      emitUpdate: false,
    });
  }, [editor, content]);

  const insertImageFile = async (
    currentEditor: Editor,
    file: File,
    position?: number,
  ) => {
    try {
      const uploaded = await uploadMedia(file, "news");

      currentEditor
        .chain()
        .focus()
        .insertContentAt(position ?? currentEditor.state.selection.anchor, {
          type: "image",
          attrs: {
            src: `${import.meta.env.VITE_API_URL}/api/files/images/${uploaded.id}`,
            mediaId: uploaded.id,
          },
        })
        .run();
    } catch (error) {
      console.error("Editor image upload failed", error);
    }
  };
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes("textStyle");

      return {
        backgroundColor: attrs.backgroundColor ?? "#f6e6e3",
        textColor: attrs.color ?? "#f6e6e3",
        isTaskList: ctx.editor.isActive("taskList") ?? false,
        isDetails: ctx.editor.isActive("details"),
        blockType: getCurrentBlockType(ctx.editor),
        lineHeight: getCurrentLineHeight(ctx.editor),
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        isInTable: ctx.editor.isActive("table") ?? false,
        isHeaderCell: getTableHeaderState(ctx.editor).isHeaderCell,
        isHeaderRow: getTableHeaderState(ctx.editor).isHeaderRow,
        isHeaderColumn: getTableHeaderState(ctx.editor).isHeaderColumn,
      };
    },
  });
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textColor = editorState.textColor;
  const backgroundColor = editorState.backgroundColor;

  const textContrastColor = textColor ? getContrastColor(textColor) : undefined;

  const backgroundContrastColor = backgroundColor
    ? getContrastColor(backgroundColor)
    : undefined;
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-container">
      <div className="editor_toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`btn $editor.isActive("bold") ? "active" : ""`}
        >
          <BoldOutlined />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`btn ${editor.isActive("italic") ? "active" : ""}`}
        >
          <ItalicOutlined />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`btn ${editor.isActive("underline") ? "active" : ""}`}
        >
          <UnderlineOutlined />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`btn ${editor.isActive({ textAlign: "left" }) ? "active" : ""}`}
        >
          <AlignLeftOutlined />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`btn ${editor.isActive({ textAlign: "center" }) ? "active" : ""}`}
        >
          <AlignCenterOutlined />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`btn ${editor.isActive({ textAlign: "right" }) ? "active" : ""}`}
        >
          <AlignRightOutlined />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`btn ${editor.isActive("superscript") ? "active" : ""}`}
        >
          x²
        </button>
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("URL:", previousUrl || "");
            if (url === null) {
              return;
            }
            if (url === "") {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          className={`btn ${editor.isActive("link") ? "active" : ""}`}
        >
          <LinkOutlined />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="btn"
        >
          <UnorderedListOutlined />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="btn"
        >
          <OrderedListOutlined />
        </button>

        {isFull && (
          <>
            <div className="vertical-separator"></div>
            <select
              className="block-type-select"
              value={
                editorState.blockType === "mixed"
                  ? ""
                  : String(editorState.blockType)
              }
              onChange={(event) => {
                const value = event.target.value;

                if (value === "paragraph") {
                  editor.chain().focus().setParagraph().run();
                  return;
                }

                editor
                  .chain()
                  .focus()
                  .setHeading({
                    level: Number(value) as HeadingLevel,
                  })
                  .run();
              }}
            >
              {editorState.blockType === "mixed" && (
                <option value="" disabled>
                  Mixed
                </option>
              )}

              <option value="paragraph">odstavec</option>
              <option value="1">H1</option>
              <option value="2">H2</option>
              <option value="3">H3</option>
              <option value="4">H4</option>
              <option value="5">H5</option>
              <option value="6">H6</option>
            </select>
            <div className="vertical-separator"></div>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`btn ${editorState.isTaskList ? "active" : ""}`}
            >
              <CheckSquareOutlined />
            </button>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="btn"
            >
              <PictureOutlined />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                void insertImageFile(editor, file);

                event.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="btn"
            >
              <LineOutlined />
            </button>
            <div
              className={`color-control background-color ${
                backgroundColor ? "has-color" : ""
              }`}
              style={
                backgroundColor
                  ? {
                      backgroundColor,
                      color: backgroundContrastColor,
                    }
                  : undefined
              }
            >
              <div className="color-picker">
                <BgColorsOutlined />

                <input
                  type="color"
                  onInput={(event) =>
                    editor
                      .chain()
                      .focus()
                      .setBackgroundColor(event.currentTarget.value)
                      .run()
                  }
                  value={backgroundColor}
                  data-testid="setBackgroundColor"
                />
              </div>

              {backgroundColor && (
                <button
                  type="button"
                  className="color-clear"
                  onClick={() =>
                    editor.chain().focus().unsetBackgroundColor().run()
                  }
                  data-testid="unsetBackgroundColor"
                  title="Odstranit barvu pozadí"
                >
                  ×
                </button>
              )}
            </div>

            <div
              className={`color-control text-color ${
                textColor ? "has-color" : ""
              }`}
              style={
                textColor
                  ? {
                      backgroundColor: textColor,
                      color: textContrastColor,
                    }
                  : undefined
              }
            >
              <div className="color-picker">
                <FontColorsOutlined />

                <input
                  type="color"
                  value={textColor}
                  onInput={(event) =>
                    editor
                      .chain()
                      .focus()
                      .setColor(event.currentTarget.value)
                      .run()
                  }
                  data-testid="setColor"
                />
              </div>

              {textColor && (
                <button
                  type="button"
                  className="color-clear"
                  onClick={() => editor.chain().focus().unsetColor().run()}
                  data-testid="unsetColor"
                  title="Odstranit barvu textu"
                >
                  ×
                </button>
              )}
            </div>
            <label className="toggle btn">
              <input
                hidden
                type="checkbox"
                id="btnToggle"
                name="btnToggle"
                checked={editorState.isDetails}
                onChange={() =>
                  editorState.isDetails
                    ? editor.chain().focus().unsetDetails().run()
                    : editor.chain().focus().setDetails().run()
                }
              />
              <span className="toggleButton">
                <CaretDownFilled />
              </span>
            </label>
            <div className="vertical-separator"></div>
            <select
              className="line-height-select"
              value={editorState.lineHeight}
              onChange={(event) => {
                editor.chain().focus().setLineHeight(event.target.value).run();
              }}
            >
              {editorState.lineHeight === "mixed" && (
                <option value="mixed" disabled>
                  Mixed
                </option>
              )}

              <option value="1.4">1.4</option>
              <option value="1.5">1.5</option>
              <option value="2.0">2.0</option>
              <option value="2.5">2.5</option>
              <option value="3.0">3.0</option>
            </select>
            <div className="vertical-separator"></div>
            <button
              type="button"
              className={`btn ${editorState.isBlockquote ? "active" : ""}`}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              " "
            </button>
            <TableToolbar
              editor={editor}
              isInTable={editorState.isInTable}
              tableState={{
                isHeaderCell: editorState.isHeaderCell,
                isHeaderRow: editorState.isHeaderRow,
                isHeaderColumn: editorState.isHeaderColumn,
              }}
            />

            <div className="emoji-menu-wrapper btn">
              <button
                type="button"
                onClick={() => setIsEmojiMenuOpen(!isEmojiMenuOpen)}
                className="btn"
              >
                <SmileOutlined />
              </button>
              {isEmojiMenuOpen && (
                <div className="emoji-menu">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      editor
                        .chain()
                        .focus()
                        .insertContent(emojiData.emoji)
                        .run();
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
