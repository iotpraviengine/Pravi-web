import { renderMarkdown, type Post } from "@/lib/content";

/**
 * Body of a project or news post. Bodies are only written in Vietnamese: in English and Chinese the
 * translated summary leads, followed by a short note and the Vietnamese text marked lang="vi".
 */
export function VietnameseBody({ post, note }: { post: Post; note: string }) {
  const body = <div className="prose" lang="vi" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />;
  if (!post.bodyInVietnamese) return <div className="container-narrow">{body}</div>;
  return (
    <div className="container-narrow">
      <p className="lead" style={{ marginBottom: 24 }}>
        {post.summary}
      </p>
      <p className="small muted" style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
        {note}
      </p>
      {body}
    </div>
  );
}
