import { Link } from "react-router-dom";
// use router's link to navigate to the detail page without reload page

/**
 * PostCard
 * - Accessible, semantic card using <article>, <header>, <time>, etc.
 * - Shows title, author (avatar), publish date, summary, and categories
 * - Title links to the detail page (/post/:id)
 */
// props: post, parse date for display, flatten categories to a list of names
export default function PostCard({ post }) {
  const date = new Date(post.publishDate);
  const categories = (post.categories ?? []).map((c) => c.name);

  // render the card layout with semantic HTML, link title to detail page
  return (
    <article className="card">
      <header className="card__header">
        <h3 className="card__title">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        
        {/* author avatar + name + publish date */}
        <div className="card__meta">
          <img
            className="card__avatar"
            src={post.author?.avatar}
            alt={post.author?.name ? `${post.author.name} avatar` : "Author avatar"}
            width={40}
            height={40}
            loading="lazy"
          />
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
      {categories.length > 0 && (
        <ul className="card__tags" aria-label="Categories">
          {categories.map((name) => (
            <li key={name} className="tag">
              {name}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
