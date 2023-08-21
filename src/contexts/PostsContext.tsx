import React from 'react';

export enum EPostTypes {
    POST = 'post',
    MEDIA = 'media',
    LINK = 'link',
}

export interface IPostData {
    title: string;
    content: string;
    contentHref?: URL;
    contentType: EPostTypes;
    commentCount: number;
    rating: number;
    subdreddit: {
        id: string;
        title: string;
    }
}

export interface IPostRecord  {
    id: string;
    dateCreated: string;
    dateModified: string;
    data: JSON;
    author: string;
    update: (updateData: any) => any;
}

export interface IPost extends IPostData {
    id: string;
    dateCreated: string;
    dateModified: string;
    author: {
        id: string;
        name?: string;
        avatar?: URL;
    },
    record: IPostRecord;
}

interface IPostsContextProps {
    posts: IPost[];
    addPost: (post: IPost) => void;
    updatePost: (postID: string, changes: Partial<IPost>) => void;
    deletePost: (postID: string) => void;
    // TODO type for customStorageToWriteTo
    createPost: (postDate: IPostData, customStorageToWriteTo?: any) => Promise<IPost>;
}

export const PostsContext = React.createContext<IPostsContextProps>({} as IPostsContextProps);
