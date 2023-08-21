"use client"
import { useContext, useState } from "react";
import Select, { SingleValue } from 'react-select';

import { EPostTypes, PostsContext } from "@/contexts/PostsContext";

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
    const [selectedSubdreddit, setSelectedSubdreddit] = useState<TSubdredditSelectOption | null>(null);
    const { createPost } = useContext(PostsContext);

    const handlePostSubmit = () => {
        const newPostData = {
            title: postTitle,
            content: textareaValue, // TODO content of diffrent types
            contentType: postType,
            commentCount: 0,
            rating: 0,
            subdreddit: {
                id: selectedSubdreddit?.value || '1',
                title: `dr/${selectedSubdreddit?.label}`,
            },
        };

        createPost(newPostData);
    }

    const handleCommunitySelectChange = (selectedOption: SingleValue<TSubdredditSelectOption | null>) => {
        setSelectedSubdreddit(selectedOption);
    }

    return (
        <div className="SubmitPost" onSubmit={handlePostSubmit}>
            <h4>Create Post</h4>

            <Select 
                options={sundredditSelectOptions} 
                defaultValue={null} 
                placeholder="Select a community"
                onChange={handleCommunitySelectChange}
            />

            <div className="SubmitPost__creation-zone">
                <div className="SubmitPost__creation-type-choice">
                    <button onClick={() => setPostType(EPostTypes.POST)}>Post</button>
                    <button onClick={() => setPostType(EPostTypes.POST)} disabled>Image & Video</button>
                </div>
                <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                {postType === EPostTypes.POST && (
                    <textarea 
                        className="SubmitPost__textarea" 
                        placeholder="Write your post here" 
                        value={textareaValue}
                        onChange={(e) => setTextareaValue(e.target.value)}
                    />
                )}
                {postType === EPostTypes.MEDIA && (
                    <input type="file" />
                )}
                <button className="SubmitPost__submit-btn" onClick={handlePostSubmit}>Post</button>
            </div>
        </div>
    )
}

export default SubmitPost;
