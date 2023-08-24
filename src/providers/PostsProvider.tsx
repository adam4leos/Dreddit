"use client"
import React, { useState, ReactNode, useContext } from 'react';
import { PostsContext, IPost, IPostData, EPostTypes } from '@/contexts/PostsContext';
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
  const dredditStorage = web5Storage.get('dreddit');
  const userStorage = web5Storage.get('user');

  const addPost = (newPost: IPost) => {
    setPosts(prevPosts => [...prevPosts, newPost]);
  };

  const createMedia = async (content) => {
    const { record } = await userStorage?.web5.dwn.records.write({
      data: content,
      message: {
          schema: dredditProtocol.types.media.schema,
      }
    });

    // update dreddit DWN
    await record?.send(dredditStorage?.did);

    console.log('MEDIA RECORD:', record);

    return record;
  }

  // TODO this is temporary to imitate other user's posts
  const createInDredditDWN = async (postData: IPostData) => {
    const { record } = await dredditStorage?.web5.dwn.records.write({
      data: JSON.stringify(postData),
      message: {
          // protocol: dredditProtocol.protocol,
          // protocolPath: EDredditTypes.POST,
          schema: dredditProtocol.types.post.schema,
          dataFormat: 'application/json',
      }
    });

    return record;
  }

  const createRecord = async (postData: IPostData) => {
      // update user DWN
      const { record } = await userStorage?.web5.dwn.records.write({
        data: JSON.stringify(postData),
        message: {
            // protocol: dredditProtocol.protocol,
            // protocolPath: EDredditTypes.POST,
            schema: dredditProtocol.types.post.schema,
            dataFormat: 'application/json',
        }
      });

      // update dreddit DWN
      await record?.send(dredditStorage?.did);

      return record;
  }

  // TODO type for storage (customStorageToWriteTo)
  const createPost = async (postData: IPostData, customAuthor: string): Promise<IPost> => {
    const mediaRecord = postData.contentType === EPostTypes.MEDIA ? await createMedia(postData.content) : null;
    const dataToPost = {...postData, content: mediaRecord ? mediaRecord.id : postData.content};
    const postRecord = customAuthor ? await createInDredditDWN(dataToPost) : await createRecord(dataToPost);

    // update local state 
    const { data, author, id, dateCreated, dateModified } = postRecord;
    const transformedData = await data.json();

    console.log({transformedData, data});

    const newPost = {
        ...transformedData,
        id,
        dateCreated,
        dateModified,
        content: mediaRecord ? await mediaRecord.data.blob() : transformedData.content,
        record: postRecord,
        author: {
            id: customAuthor || author,
        },
    };

    console.log('CREATION RES: ', {newPost, postData});

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
