"use client"
import { PostsContext } from "@/contexts/PostsContext";
import { useContext, useState } from "react";

const SubmitPost = () => {
    const [textareaValue, setTextareaValue] = useState('');
    const { addPost } = useContext(PostsContext);

    const handlePostSubmit = () => {
        // addPost();
    }

    return (
        <form className="SubmitPost" onSubmit={handlePostSubmit}>
            <textarea 
                className="SubmitPost__textarea" 
                placeholder="Write your post here" 
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
            />
            <button className="SubmitPost__submit-btn" type="submit">Post</button>
        </form>
    )
}

export default SubmitPost;
