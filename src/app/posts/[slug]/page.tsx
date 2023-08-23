'use client';
import { useContext } from "react";

import { Post } from "@/components/Post/Post";
import { PostsContext } from "@/contexts/PostsContext";


const PostPage = ({ params }: { params: { slug: string }}) => {
  const { posts } = useContext(PostsContext);
  const post = posts.find(({ id }) => id === params.slug);
  
  return (
    <div>
      {post ? <Post post={post} isStandalone={true} /> : 'Not found' }
    </div>
  );
}

export default PostPage;
