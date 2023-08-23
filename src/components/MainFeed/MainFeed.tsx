import { useContext } from "react";

import { FeedPost } from "@/components/FeedPost/FeedPost";
import { PostsContext } from "@/contexts/PostsContext";

export const MainFeed = () => {
    const { posts } = useContext(PostsContext);

    return (
        <div className="Feed">
            {posts.map(post => <FeedPost key={post.id} post={post} isMainFeedPost={true} />)}
        </div>
    );
}