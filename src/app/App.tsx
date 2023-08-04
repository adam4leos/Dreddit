"use client"
import { useCallback, useContext, useEffect, useState } from "react"
import { Web5 } from '@tbd54566975/web5';

import { Web5StorageContext } from "./contexts/Web5StorageContext";

const dredditProtocol = {
    'protocol': 'http://dreddit.xyz/protocol',
    'types': {
        'post': {
            'schema': 'http://dreddit.xyz/schemas/post',
            'dataFormats': [
                'application/json'
            ]
        },
    },
    'structure': {
        'post': {
            '$actions': [
                {
                    'who': 'author',
                    'of': 'post',
                    'can': 'write'
                },
                {
                    'who': 'anyone',
                    'can': 'read'
                }
            ],
        }
    }
};

interface IPost {
    id: string;
    title: string;
    content: string;
    contentHref: URL;
    contentType?: 'text' | 'img';
    dateCreated: string;
    dateModified: string;
    commentCount: number;
    rating: number;
    author: {
        id: string;
        name: string;
        avatar?: URL;
    },
    subreddit: {
        id: string;
        title: string;
    }
}

export default function App() {
    const { web5Storage, addToWeb5Storage } = useContext(Web5StorageContext);
    const [posts, setPosts] = useState<IPost[]>([]);

    const createPosts = async () => {
        const aliceStorage = web5Storage?.get('alice');
        const bobStorage = web5Storage?.get('bob');
        const dredditStorage = web5Storage?.get('dreddit');

        if (!aliceStorage || !bobStorage || !dredditStorage) return;

        const alicePost = {
            text: "Alice's first post! It's a great post!",
        };

        const { record: alicePostRecord } = await aliceStorage.web5.dwn.records.write({
            data: alicePost,
            message: {
                schema: 'https://schema.org/SocialMediaPosting',
            }
        });

        const { status: aliceSendStatus } = await alicePostRecord?.send(dredditStorage.did);

        console.log({ aliceSendStatus });

        const bobPost = {
            text: "BOB LIKE CATS!!!!",
        };
        const { record: bobPostRecord } = await bobStorage.web5.dwn.records.write({
            data: bobPost,
            message: {
                schema: 'https://schema.org/SocialMediaPosting',
            }
        });

        const { status: bobSendStatus } = await bobPostRecord?.send(dredditStorage.did);

        console.log({ bobSendStatus })
        
        return [alicePost, bobPost];
    };

    const init = useCallback(async () => {
        const initConnection = async () => {
            if (web5Storage.has('user')) return;

            const { web5, did: userDid } = await Web5.connect();
            const { web5: a5, did: aliceDid } = await Web5.connect();
            const { web5: b5, did: bobDid } = await Web5.connect();
   
            addToWeb5Storage('user', {did: userDid, web5});
            addToWeb5Storage('alice', {did: aliceDid, web5: a5});
            addToWeb5Storage('bob', {did: bobDid, web5: b5});
        };
        
        const getPosts = async () => {
            const userStorage = web5Storage?.get('user');
            const dredditDid = web5Storage.get('dreddit')?.did;

            if (!dredditDid || !userStorage || posts.length > 0) return;

            const { records } = await userStorage.web5.dwn.records.query({
                from: dredditDid,
                message: {
                    filter: {
                        schema: 'https://schema.org/SocialMediaPosting',
                        dataFormat: "application/json",
                    },
                },
            });

            let newPosts = [];

            if (records.length > 0) {
                for await (const record of (records || [])) {
                    console.log({record});
                    const {data, author, id, dateCreated, dateModified} = record;
                    const content = await data.text() as string;
    
                    newPosts.push({
                        id,
                        content,
                        dateCreated,
                        dateModified,
                        author: {
                            id: author,
                        }
                    });
                }    
            } else {
                newPosts = await createPosts() || [];
            }

            setPosts(newPosts)
        }

        await initConnection();
        await getPosts();
    }, [web5Storage, addToWeb5Storage]);

    useEffect(() => {
        if (web5Storage.has('dreddit')) return;
        
        const createDredditDWN = async () => {
            const { web5, did } = await Web5.connect();

            addToWeb5Storage('dreddit', {did, web5});
        };

        createDredditDWN();
    }, [web5Storage, addToWeb5Storage])

    useEffect(() => {
        init();
    }, [init])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <h1>Dreddit</h1>

                {posts.map((post, i) => <p key={i}>Post content: {post.text}</p>)}
            </div>
        </main>
    )
}
