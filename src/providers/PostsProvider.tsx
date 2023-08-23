"use client"
import React, { useState, ReactNode, useContext } from 'react';
import { PostsContext, IPost, IPostData } from '@/contexts/PostsContext';
import { dredditProtocol } from '@/protocol';
import { Web5StorageContext } from '@/contexts/Web5StorageContext';

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
          slug: 'All',
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
          slug: 'All',
      },
  },
];


export const PostsProvider: React.FC<IPostsProviderProps> = ({ children }) => {
  const { web5Storage } = useContext(Web5StorageContext);
  const [posts, setPosts] = useState<IPost[]>([]);

  const addPost = (newPost: IPost) => {
    setPosts(prevPosts => [...prevPosts, newPost]);
  };

  // TODO type for storage (customStorageToWriteTo)
  const createPost = async (postData: IPostData, customStorageToWriteTo?: any): Promise<IPost> => {
    const dredditStorage = web5Storage.get('dreddit');
    const userStorage = web5Storage.get('user');
    const storageToWriteTo = customStorageToWriteTo || userStorage;

    // update user DWN
    const { record } = await storageToWriteTo.web5.dwn.records.write({
      data: JSON.stringify(postData),
      message: {
          // protocol: dredditProtocol.protocol,
          // protocolPath: EDredditTypes.POST,
          schema: dredditProtocol.types.post.schema,
      }
    });

    // update dreddit DWN
    await record?.send(dredditStorage?.did);

    // update local state 
    const { data, author, id, dateCreated, dateModified } = record;
    const transformedData = await data.json();
    const newPost = {
        ...transformedData,
        record,
        id,
        dateCreated,
        dateModified,
        author: {
            id: author,
        },
    };

    console.log('CREATION', {newPost, postData});

    addPost(newPost);

    return newPost;
  }

  const deletePost = (postID: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postID));
  }

  const updatePost = (postID: string, changes: Partial<IPost>) => {
    setPosts(prevPosts => prevPosts.map(post => {
      return post.id === postID ? {...post, ...changes} : post;
    }));
  }

  return (
    <PostsContext.Provider value={{ posts, addPost, updatePost, createPost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
};
