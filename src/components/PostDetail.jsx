import { useParams, Link } from "react-router-dom";

/**
 * PostDetail
 * - Shows full details of a single post
 * - Uses useParams to get the :id from the URL
 * 
 */

// receive full posts array through props, lookup selected post by id from the route
export default function PostDetail({ posts }) {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  // if no post found, show a message and a back link
  if (!post) {
    return (
      <div>
        <p>Post not found.</p>
        <Link className="btn btn--ghost" to="/">
          ← Back
        </Link>
      </div>
    );
  }
  
  // parse the publish date
  const date = new Date(post.publishDate);

  // render the post details
  return (
    <article className="card">
      <header className="card__header">
        <h2 className="card__title">{post.title}</h2>
        <div className="card__meta">
          <img
            className="card__avatar"
            src={post.author?.avatar}
            alt={post.author?.name ? `${post.author.name} avatar` : "Author avatar"}
            width={40}
            height={40}
            loading="lazy"
          />

          {/* author name + publish date */}
          <div>
            <p className="card__author">{post.author?.name}</p>
            <time className="card__date" dateTime={post.publishDate}>
              {date.toLocaleDateString()}
            </time>
          </div>
        </div>
      </header>

      <p className="card__summary">{post.summary}</p>
      
      {/* if there are categories, show them as a list of tags */}
      {post.categories?.length > 0 && (
        <ul className="card__tags" aria-label="Categories">
          {post.categories.map((c) => (
            <li key={c.id ?? c.name} className="tag">
              {c.name}
            </li>
          ))}
        </ul>
      )}

      {/* back link to the list */}
      <Link className="btn btn--ghost" to="/">
        ← Back to list
      </Link>
    </article>
  );
}
