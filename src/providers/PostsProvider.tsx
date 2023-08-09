"use client"
import React, { useState, ReactNode } from 'react';
import { PostsContext, IPost } from '../contexts/PostsContext';

interface IPostsProviderProps {
  children: ReactNode;
}

const OFFLINE_DEFAULT_POSTS = [
  {
      content: "Alice's first post! It's a great post!",
      title: "Alice's FIRST POST!",
      id: "did:alicefirstpostdid",
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
          id: "did:alicesuperdid",
      },
      subdreddit: {
          id: '1',
          title: 'dr/All',
      },
  }, 
  {
      content: "I LOVE CATS!",
      title: "What about cats?!?!",
      id: "did:bobcatpostdid",
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
          id: "did:bobsuperdid",
      },
      subdreddit: {
          id: '1',
          title: 'dr/All',
      },
  },
];


export const PostsProvider: React.FC<IPostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<IPost[]>([]);

  const addPost = (newPost: IPost) => {
    setPosts(prevPosts => [...prevPosts, newPost]);
  };

  const deletePost = (postID: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postID));
  }

  const updatePost = (postID: string, changes: Partial<IPost>) => {
    setPosts(prevPosts => prevPosts.map(post => {
      return post.id === postID ? {...post, ...changes} : post;
    }));
  }

  return (
    <PostsContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
};
