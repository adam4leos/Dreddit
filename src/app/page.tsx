"use client"
import { Suspense, useCallback, useContext, useEffect, useState } from "react"
import { Web5 } from '@tbd54566975/web5';

import { Web5StorageContext } from "@/contexts/Web5StorageContext";
import { EPostTypes, PostsContext } from "@/contexts/PostsContext";
import { Feed } from "@/components/Feed/Feed";
import { NewPostButton } from "@/components/NewPostButton/NewPostButton";
import { dredditProtocol, EDredditTypes } from "@/protocol";
import { Spinner } from "@/components/Spinner/Spinner";

export default function App() {
    const { web5Storage, addToWeb5Storage } = useContext(Web5StorageContext);
    const { posts, addPost, createPost } = useContext(PostsContext);
    const [isLoading, setIsLoading] = useState(true);

    const mockPosts = async () => {
        const aliceStorage = web5Storage?.get('alice');
        const bobStorage = web5Storage?.get('bob');
        const dredditStorage = web5Storage?.get('dreddit');

        if (!aliceStorage || !bobStorage || !dredditStorage) return;

        const alicePost1 = {
            title: "Alice's FIRST POST!",
            content: "Alice's first post! It's a great post!",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: 0,
            subdreddit: {
                id: '1',
                title: 'dr/All',
            },
        };
        const alicePost2 = {
            title: "How about another post?..",
            content: "Another post from Alice... Yey...",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: 0,
            subdreddit: {
                id: '1',
                title: 'dr/All',
            },
        };
        const bobPost1 = {
            title: "What about cats?!?!",
            content: "I LOVE CATS!",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: 0,
            subdreddit: {
                id: '2',
                title: 'dr/Cats',
            },
        };
        const bobPost2 = {
            title: "Bob thinks Alice should stop spamming dr/All",
            content: "Alice cmon, this is not you personal blog! This is Dreddit!",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: 0,
            subdreddit: {
                id: '1',
                title: 'dr/All',
            },
        };
        const bobPost3 = {
            title: "Let's talk decentralization!",
            content: "So happy I stumbled on this subdreddit! You folks are amazing! But I'd like to know more about how you're going to achive your goals!",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: 0,
            subdreddit: {
                id: '3',
                title: 'dr/TBD',
            },
        };

        await createPost(alicePost1, aliceStorage);
        await createPost(alicePost2, aliceStorage);
        await createPost(bobPost1, bobStorage);
        await createPost(bobPost2, bobStorage);
        await createPost(bobPost3, bobStorage);
    };

    const init = useCallback(async () => {
        const initConnection = async () => {
            if (web5Storage.has('user')) return;

            const { web5, did: userDid } = await Web5.connect();
            const { web5: a5, did: aliceDid } = await Web5.connect();
            const { web5: b5, did: bobDid } = await Web5.connect();

            addToWeb5Storage('user', { did: userDid, web5 });
            addToWeb5Storage('alice', { did: aliceDid, web5: a5 });
            addToWeb5Storage('bob', { did: bobDid, web5: b5 });
        };

        const getPosts = async () => {
            const userStorage = web5Storage?.get('user');
            const dredditDid = web5Storage.get('dreddit')?.did;

            if (!dredditDid || !userStorage || posts.length > 0) return;

            const { records } = await userStorage.web5.dwn.records.query({
                from: dredditDid,
                message: {
                    filter: {
                        protocol: dredditProtocol.protocol,
                        dataFormat: "application/json",
                    },
                },
            });

            if (records.length === 0) mockPosts();
            else {
                const newPosts = [];

                for await (const record of (records || [])) {
                    const { data, author, id, dateCreated, dateModified } = record;
                    const transformedData = await data.json();

                    console.log({ data, transformedData });

                    newPosts.push({
                        ...transformedData,
                        record,
                        id,
                        dateCreated,
                        dateModified,
                        author: {
                            id: author,
                        },
                    });
                }

                newPosts.forEach(addPost);
            }
        }

        const createDredditDWN = async () => {
            if (web5Storage.has('dreddit')) return;

            // { techPreview: { dwnEndpoints: ["http://localhost:3000"] } 
            const { web5, did } = await Web5.connect();

            addToWeb5Storage('dreddit', { did, web5 });
        };

        await createDredditDWN();
        await initConnection();
        await getPosts();

        setIsLoading(false);
    }, [web5Storage, addToWeb5Storage]);

    useEffect(() => {
        init();
    }, [init]);

    return (
        <>
            {isLoading
                ? <Spinner />
                : (
                    <>
                        <NewPostButton />
                        <Feed />
                    </>
                )
            }
        </>
    );
}
