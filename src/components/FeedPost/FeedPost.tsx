import { useContext } from "react";
import Link from 'next/link';

import { Post } from "@/components/Post/Post";
import { IPost } from "@/contexts/PostsContext";

import './FeedPost.scss';

interface IFeedPostProps {
    post: IPost;
    isMainFeedPost?: boolean;
};

export const FeedPost = ({ post, isMainFeedPost }: IFeedPostProps) => {
    return (
        <div className="FeedPost">
            <Link href={`/posts/${encodeURIComponent(post.id)}`} className="FeedPost__link">
                <Post post={post} isMainFeedPost={isMainFeedPost} />
            </Link>
            <span className="FeedPost__delimiter"></span>
        </div>
    );
}