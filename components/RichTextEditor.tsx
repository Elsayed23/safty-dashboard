"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ImageIcon,
    LinkIcon,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import Modal from "./text-editor-modal";

const RichTextEditor = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => {
    const editor = useEditor({
        editorProps: {
            attributes: {
                class:
                    "min-h-[350px] job_desciption max-h-[350px] w-full rounded-md rounded-tr-none rounded-tl-none border border-input bg-transparent px-3 py-2 border-t-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto leading-relaxed", // Add `leading-relaxed` or a custom line-height class
            },
        },
        extensions: [
            StarterKit.configure({
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal pl-4 leading-relaxed", // Add line spacing here
                    },
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc pl-4 leading-relaxed", // Add line spacing here
                    },
                },
            }),
            Heading.configure({
                levels: [1, 2, 3],
                HTMLAttributes: {
                    class: "leading-tight", // Adjust heading line spacing
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Image,
            Link,
            TextStyle,
            Color.configure({
                types: ["textStyle"],
            }),
            Underline,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    return (
        <>
            {editor ? <RichTextEditorToolbar editor={editor} /> : null}
            <EditorContent editor={editor} />
        </>
    );
};

const RichTextEditorToolbar = ({ editor }: { editor: Editor }) => {
    const [isImageModalOpen, setImageModalOpen] = useState(false);
    const [isLinkModalOpen, setLinkModalOpen] = useState(false);

    const addImage = (url: string) => {
        editor.chain().focus().setImage({ src: url }).run();
    };

    const addLink = (url: string) => {
        editor.chain().focus().setLink({ href: url }).run();
    };

    return (
        <div className="border border-input bg-transparent rounded-tr-md rounded-tl-md p-1 flex flex-row flex-wrap items-center gap-1">
            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
            >
                <span className="h-4 w-4">H1</span>
            </Toggle>
            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <span className="h-4 w-4">H2</span>
            </Toggle>
            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
            >
                <span className="h-4 w-4">H3</span>
            </Toggle>
            <Separator orientation="vertical" className="w-[1px] h-8" />

            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive("underline")} // New toggle for underline
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            >
                <span className="h-4 w-4">U</span>
            </Toggle>
            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Separator orientation="vertical" className="w-[1px] h-8" />

            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Separator orientation="vertical" className="w-[1px] h-8" />

            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
            >
                <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
            >
                <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
                variant="default"
                size="sm"
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
            >
                <AlignRight className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="w-[1px] h-8" />
            <Toggle
                variant="default"
                size="sm"
                onPressedChange={() => setImageModalOpen(true)}
            >
                <ImageIcon className="h-4 w-4" />
            </Toggle>

            <Toggle
                variant="default"
                size="sm"
                onPressedChange={() => setLinkModalOpen(true)}
            >
                <LinkIcon className="h-4 w-4" />
            </Toggle>

            {/* Image Modal */}
            <Modal
                isOpen={isImageModalOpen}
                onClose={() => setImageModalOpen(false)}
                onConfirm={addImage}
                title="Add Image URL"
            />

            {/* Link Modal */}
            <Modal
                isOpen={isLinkModalOpen}
                onClose={() => setLinkModalOpen(false)}
                onConfirm={addLink}
                title="Add Link URL"
            />

            {/* Text Color Picker */}
            <div className="flex gap-1 ml-auto">
                <input
                    type="color"
                    onChange={(event) =>
                        editor.chain().focus().setColor(event.target.value).run()
                    }
                    title="Text Color"
                    style={{
                        width: "40px",
                        height: "40px",
                        border: "none",
                        padding: "0",
                        margin: "0",
                    }}
                />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetColor().run()}
                    style={{ padding: "0 5px" }}
                >
                    Clear Color
                </button>
            </div>
        </div>
    );
};

export default RichTextEditor;
