import { useContext } from "react";

import { FeedPost } from "@/components/Feed/FeedPost";
import { PostsContext } from "@/contexts/PostsContext";

export const Feed = () => {
    const { posts } = useContext(PostsContext);

    return (
        <div className="Feed">
            {posts.map(post => <FeedPost key={post.id} post={post} />)}
        </div>
    );
}