"use client"
import { useContext, useState } from "react";
import Select from 'react-select';

import { PostsContext } from "@/contexts/PostsContext";

enum EPostTypes {
    POST = 'post',
    MEDIA = 'media',
    LINK = 'link',
}

const sundredditSelectOptions = [
    { value: '1', label: 'All' },
    { value: '2', label: 'Cats' },
    { value: '3', label: 'TBD' },
];

const SubmitPost = () => {
    const [postType, setPostType] = useState(EPostTypes.POST);
    const [textareaValue, setTextareaValue] = useState('');
    const { addPost } = useContext(PostsContext);

    const handlePostSubmit = () => {
        // addPost();
    }

    const handleCommunitySelectChange = (selectedOption: unknown) => {
        console.log(selectedOption);
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
                    <button>Post</button>
                    <button disabled>Image & Video</button>
                </div>
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
                <button className="SubmitPost__submit-btn">Post</button>
            </div>
        </div>
    )
}

export default SubmitPost;
