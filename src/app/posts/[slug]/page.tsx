'use client';
import { useContext } from "react";
import { notFound } from 'next/navigation'

import { Post } from "@/components/Post/Post";
import { IPost, PostsContext } from "@/contexts/PostsContext";

const PostPage = ({ params }: { params: { slug: string }}) => {
  const { posts } = useContext(PostsContext);
  const post = posts.find(({ id }) => id === params.slug);

  if (!post) {
    notFound();
  }
  
  return (
    <div>
      <Post post={post as IPost} isStandalone={true} />
    </div>
  );
}

export default PostPage;
