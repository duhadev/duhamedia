'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  action: (formData: FormData) => Promise<void>;
  defaultTitle?: string;
  defaultContent?: string;
  defaultPublished?: boolean;
  submitLabel?: string;
};

export default function PostEditor({
  action,
  defaultTitle = '',
  defaultContent = '',
  defaultPublished = false,
  submitLabel = 'Save',
}: Props) {
  const [content, setContent] = useState(defaultContent);
  const [preview, setPreview] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label htmlFor="title" className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest block mb-1.5">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={defaultTitle}
          required
          className="w-full border border-neutral-200 rounded-sm px-4 py-2.5 text-base text-brand-ink bg-white focus:outline-none focus:border-brand-magenta min-h-[44px]"
          placeholder="Post title"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="content" className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest">
            Content (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="font-mono text-xs text-brand-crimson underline uppercase tracking-wider"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {preview ? (
          <div className="prose prose-sm max-w-none border border-neutral-200 rounded-sm bg-white px-5 py-4 min-h-[300px] text-brand-ink">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={16}
            className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-sm font-mono text-brand-ink bg-white focus:outline-none focus:border-brand-magenta resize-y"
            placeholder="Write in Markdown…"
          />
        )}
        {/* hidden field keeps value in sync when preview is active */}
        {preview && <input type="hidden" name="content" value={content} />}
      </div>

      <div className="flex items-center gap-3">
        <label className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest">
          Status
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="hidden"
            name="published"
            value="false"
          />
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={defaultPublished}
            className="w-4 h-4 accent-brand-magenta"
          />
          <span className="text-sm text-brand-ink">Publish</span>
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-2.5 min-h-[44px] hover:bg-brand-crimson transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
