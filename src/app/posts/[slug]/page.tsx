'use client';
import { useContext } from "react";

import { FeedPost } from "@/components/FeedPost/FeedPost";
import { PostsContext } from "@/contexts/PostsContext";


const PostPage = ({ params }: { params: { slug: string }}) => {
  const { posts } = useContext(PostsContext);
  const post = posts.find(({ id }) => id === params.slug);
  
  return (
    <div>
      {post ? <FeedPost post={post} /> : 'Not found' }
    </div>
  );
}

export default PostPage;
