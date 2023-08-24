"use client"
import { useCallback, useContext, useEffect, useState } from "react"
import { Web5 } from '@tbd54566975/web5';

import { Web5StorageContext } from "@/contexts/Web5StorageContext";
import { EPostTypes, PostsContext } from "@/contexts/PostsContext";
import { MainFeed } from "@/components/MainFeed/MainFeed";
import { NewPostButton } from "@/components/NewPostButton/NewPostButton";
import { dredditProtocol, EDredditTypes } from "@/protocol";
import { Spinner } from "@/components/Spinner/Spinner";

export default function App() {
    const { web5Storage, addToWeb5Storage } = useContext(Web5StorageContext);
    const { posts, addPost, createPost } = useContext(PostsContext);
    const [isLoading, setIsLoading] = useState(true);

    const mockPosts = async () => {
        const dredditStorage = web5Storage?.get('dreddit');

        if (!dredditStorage) return;

        const alicePost1 = {
            title: "Alice's FIRST POST!",
            content: "Alice's first post! It's a great post!",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: 0,
            subdreddit: {
                id: '1',
                slug: 'All',
            },
        };
        const alicePost2 = {
            title: "How about another post?..",
            content: "Another post from Alice... Yey...",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: -2,
            subdreddit: {
                id: '1',
                slug: 'All',
            },
        };
        const bobPost1 = {
            title: "What about cats?!?!",
            content: "I LOVE CATS!",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: 9999,
            subdreddit: {
                id: '2',
                slug: 'Cats',
            },
        };
        const bobPost2 = {
            title: "Bob thinks Alice should stop spamming dr/All",
            content: "Alice cmon, this is not you personal blog! This is Dreddit!",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: 1,
            subdreddit: {
                id: '1',
                slug: 'All',
            },
        };
        const bobPost3 = {
            title: "Let's talk decentralization!",
            content: "So happy I stumbled on this subdreddit! You folks are amazing! But I'd like to know more about how you're going to achive your goals!",
            contentType: EPostTypes.POST,
            commentCount: 0,
            rating: 69,
            subdreddit: {
                id: '3',
                slug: 'TBD',
            },
        };

        const {id: aliseDid} = await Web5.did.create('ion');
        const {id: bobDid} = await Web5.did.create('ion');

        await createPost(alicePost1, aliseDid);
        await createPost(alicePost2, aliseDid);
        await createPost(bobPost1, bobDid);
        await createPost(bobPost2, bobDid);
        await createPost(bobPost3, bobDid);
    };

    const init = useCallback(async () => {
        const initConnection = async () => {
            if (web5Storage.has('user')) return;

            const { web5, did: userDid } = await Web5.connect();
            addToWeb5Storage('user', { did: userDid, web5 });
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
                        // dataFormat: "application/json",
                    },
                },
            });

            if (records.length === 0) mockPosts();
            else {
                const newPosts = [];

                for await (const record of (records || [])) {
                    const { data, author, id, dateCreated, dateModified } = record;
                    const transformedData = await data.json();
                    let mediaRecord = null; 

                    if (transformedData.contentType === EPostTypes.MEDIA) {
                        const { records } = await userStorage.web5.dwn.records.query({
                            from: dredditDid,
                            message: {
                                filter: {
                                    // TODO consider another property for that, contentRef
                                    recordId: transformedData.content,
                                },
                            },
                        });

                        console.log('MEDIA RECORD: ', records);

                        mediaRecord = records[0];
                    }

                    newPosts.push({
                        ...transformedData,
                        content: mediaRecord ? await mediaRecord.data.blob() : transformedData.content,
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
                        <MainFeed />
                    </>
                )
            }
        </>
    );
}
