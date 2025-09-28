import PostCard from "./PostCard";
import { TransitionGroup, CSSTransition } from "react-transition-group";

/**
 * PostList
 * - Renders posts as a responsive CSS grid of <article> cards
 * - Animates enter/exit with react-transition-group (React 17 friendly)
 */

// props: posts (array of post objects)
export default function PostList({ posts }) {
  // render the list of posts as a grid of cards, each in a transition wrapper
  return (
    <ul className="grid">
      <TransitionGroup component={null}>
        {posts.map((p) => (
          <CSSTransition key={p.id} classNames="fade" timeout={200}>
            <li className="grid__item">
              <PostCard post={p} />
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </ul>
  );
}
