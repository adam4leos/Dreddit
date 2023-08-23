'use client';
import { useContext, useRef } from "react";
import { notFound } from 'next/navigation'

import { Post } from "@/components/Post/Post";
import { IPost, PostsContext } from "@/contexts/PostsContext";
import { Comments } from "@/components/Comments/Comments";

const PostPage = ({ params }: { params: { slug: string }}) => {
  const { posts } = useContext(PostsContext);
  const post = posts.find(({ id }) => id === params.slug);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  if (!post) {
    notFound();
  }
  
  return (
    <div>
      <Post post={post as IPost} isStandalone={true} commentsRef={commentsRef}  />
      <Comments ref={commentsRef} postID={post.id} />
    </div>
  );
}

export default PostPage;
