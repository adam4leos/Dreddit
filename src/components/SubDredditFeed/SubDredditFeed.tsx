import { useContext } from "react";

import { FeedPost } from "@/components/FeedPost/FeedPost";
import { PostsContext } from "@/contexts/PostsContext";

interface ISubDredditFeedProps {
    subdredditSlug: string;
}

export const SubDredditFeed = ({ subdredditSlug }: ISubDredditFeedProps) => {
    const { posts } = useContext(PostsContext);

    // TODO more performant filtering/conditional rendering of targeted posts
    return (
        <div className="Feed">
            {posts.map(post => (
                post.subdreddit.slug === subdredditSlug  && <FeedPost key={post.id} post={post} />
            ))}
        </div>
    );
}
