"use client"
import { useContext, useEffect, useState } from "react";
import Select, { SingleValue } from 'react-select';
import { useRouter } from 'next/navigation';

import { EPostTypes, PostsContext } from "@/contexts/PostsContext";
import './SubmitPost.scss';
import { dredditProtocol } from "@/protocol";
import { Web5StorageContext } from "@/contexts/Web5StorageContext";

type TSubdredditSelectOption = {
    value: string;
    label: string;
}

// TODO - fetch them from dreddit DWN, I guess
const sundredditSelectOptions: TSubdredditSelectOption[] = [
    { value: '1', label: 'All' },
    { value: '2', label: 'Cats' },
    { value: '3', label: 'TBD' },
];

const SubmitPost = () => {
    const [postType, setPostType] = useState(EPostTypes.POST);
    const [textareaValue, setTextareaValue] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File>();
    const [isGoodToPost, setIsGoodToPost] = useState(false);
    const [selectedSubdreddit, setSelectedSubdreddit] = useState<TSubdredditSelectOption | null>(null);
    const { createPost } = useContext(PostsContext);
    const router = useRouter();


    // TODO remove
    const { web5Storage } = useContext(Web5StorageContext);
 
    useEffect(() => {
        const isTitleValid = postTitle.length > 0;
        const isCommunityChosen = selectedSubdreddit !== null;
        const isContentValid = postType === EPostTypes.MEDIA ? uploadedFile !== undefined : true;

        setIsGoodToPost(isTitleValid && isCommunityChosen && isContentValid);
    }, [postTitle, selectedSubdreddit, uploadedFile]);

    const handlePostSubmit = async () => {
        let content: string | File;

        console.log(uploadedFile);
        if (postType === EPostTypes.POST) {
            content = textareaValue;
        } else {
            content = uploadedFile as File;
        }
        
        const newPostData = {
            content,
            title: postTitle,
            contentType: postType,
            commentCount: 0,
            rating: 0,
            subdreddit: {
                id: selectedSubdreddit?.value || '1',
                slug: selectedSubdreddit?.label || 'All',
            },
        };

        try {
            const newPost = await createPost(newPostData);
            router.push(`/posts/${newPost.id}`);
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    const handleCommunitySelectChange = (selectedOption: SingleValue<TSubdredditSelectOption | null>) => {
        setSelectedSubdreddit(selectedOption);
    }

    return (
        <div className="SubmitPost" onSubmit={handlePostSubmit}>
            <h4 className="SubmitPost__header">Create Post</h4>

            <Select 
                className="SubmitPost__select"
                classNamePrefix="react-select"
                options={sundredditSelectOptions} 
                defaultValue={null} 
                placeholder="Choose a community"
                onChange={handleCommunitySelectChange}
            />

            <div className="SubmitPost__creation-zone">
                <div className="SubmitPost__type-choices">
                    <button 
                        className={`SubmitPost__type-btn ${postType === EPostTypes.POST && 'SubmitPost__type-btn--active'}`}
                        onClick={() => setPostType(EPostTypes.POST)}
                    >Post</button>
                    <button 
                        className={`SubmitPost__type-btn ${postType === EPostTypes.MEDIA && 'SubmitPost__type-btn--active'}`}
                        onClick={() => setPostType(EPostTypes.MEDIA)} 
                    >Image & Video</button>
                </div>
                <div className="SubmitPost__content">
                    <input 
                        className="SubmitPost__title"
                        type="text" 
                        value={postTitle} 
                        placeholder="Title"
                        onChange={(e) => setPostTitle(e.target.value)} 
                    />
                    {postType === EPostTypes.POST && (
                        <textarea 
                            className="SubmitPost__textarea" 
                            placeholder="Text (optional)" 
                            value={textareaValue}
                            onChange={(e) => setTextareaValue(e.target.value)}
                        />
                    )}
                    {postType === EPostTypes.MEDIA && (
                        <input type="file" onChange={(e) => setUploadedFile(e.target.files[0])} />
                    )}
                </div>
                
                <div className="SubmitPost__actions">
                    <button
                        className="SubmitPost__action-btn SubmitPost__actin-btn--submit" 
                        onClick={handlePostSubmit}
                        disabled={!isGoodToPost}
                    >Post</button>
                </div>
            </div>
        </div>
    )
}

export default SubmitPost;
