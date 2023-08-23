import Link from 'next/link';

import { Post } from "@/components/Post/Post";
import { IPost } from "@/contexts/PostsContext";

import './FeedPost.scss';

interface IFeedPostProps {
    post: IPost;
};

export const FeedPost = ({ post }: IFeedPostProps) => {
    return (
        <div className="FeedPost">
            <Link href={`/posts/${encodeURIComponent(post.id)}`} className="FeedPost__link">
                <Post post={post} />
            </Link>
            <span className="FeedPost__delimiter"></span>
        </div>
    );
}