import { useContext } from "react";
import Link from 'next/link';

import { IPost, PostsContext } from "@/contexts/PostsContext";
import { timeSince } from "@/utils/timeSince";

import './Post.scss';

interface IPostProps {
    post: IPost;
    isMainFeedPost?: boolean;
};

export const Post = ({ post, isMainFeedPost }: IPostProps) => {
    const { record, id, title, content, author, subdreddit, dateCreated, commentCount, rating, contentType } = post;
    const { updatePost } = useContext(PostsContext);

    const getPostedTime = (postCreationISO: string) => timeSince(new Date(postCreationISO));
    const handleRatingChange = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>, change: number) => {
        e.preventDefault();

        const response = await record.update({
            data: JSON.stringify({
                content,
                title,
                contentType,
                commentCount,
                subdreddit,
                rating: rating + change,
            }),
        });

        if (response?.status?.code === 202) {
            updatePost(id, { rating: rating + change });
        }
    };
    const getFeedPostHeadAuthor = () => {
        const authorRef = {
            link: isMainFeedPost ? `/dr/${encodeURIComponent(subdreddit.slug)}` : `/u/${encodeURIComponent(author.id)}`,
            icon: isMainFeedPost ? subdreddit.slug.slice(0, 1) : author.id.slice(-1), // TODO support icons
            title:  isMainFeedPost ? `dr/${subdreddit.slug}` : `u/${author.id.slice(-10)}`, // TODO suppoer user name if it'll appear
        };

        return (
            <Link href={authorRef.link} className="Post__subdreddit-link">
                <span className="Post__subdreddit-icon">{authorRef.icon}</span>
                <span className="Post__subdreddit-title">{authorRef.title}</span>
            </Link>
        )
    }

    return (
        <div className="Post">
                <div className="Post__head">
                    {getFeedPostHeadAuthor()}
                    <span className="Post__subreddit-link-separator">•</span>
                    <span className="Post__stamp">{getPostedTime(dateCreated)} ago</span>
                </div>
                <div className="Post__body">
                    <h4 className="Post__title">{title}</h4>
                    <div className="Post__content">{content}</div>
                </div>
                <div className="Post__footer">
                    <button className="Post__footer-btn Post__footer-btn--rating">
                        <svg className="Post__footer-icon Post__footer-icon--rating" onClick={(e) => handleRatingChange(e, 1)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="16" width="16" icon-name="upvote-outline" fill="currentColor"><g clipPath="url(#clip0_472_1110)"><path d="M12.877 19H7.123A1.125 1.125 0 016 17.877V11H2.126a1.114 1.114 0 01-1.007-.7 1.249 1.249 0 01.171-1.343L9.166.368a1.128 1.128 0 011.668.004l7.872 8.581a1.252 1.252 0 01.176 1.348 1.114 1.114 0 01-1.005.7H14v6.877A1.125 1.125 0 0112.877 19zM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8zM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016z"></path></g><defs><clipPath id="clip0_472_1110"><path d="M0 0h20v20H0z"></path></clipPath></defs></svg>
                        <span className="Post__rating">{rating}</span>
                        <svg className="Post__footer-icon Post__footer-icon--rating" onClick={(e) => handleRatingChange(e, -1)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="16" width="16" icon-name="downvote-outline" fill="currentColor"><g clipPath="url(#clip0_472_1137)"><path d="M10 20a1.122 1.122 0 01-.834-.372l-7.872-8.581A1.251 1.251 0 011.118 9.7 1.114 1.114 0 012.123 9H6V2.123A1.125 1.125 0 017.123 1h5.754A1.125 1.125 0 0114 2.123V9h3.874a1.114 1.114 0 011.007.7 1.25 1.25 0 01-.171 1.345l-7.876 8.589A1.128 1.128 0 0110 20zm-7.684-9.75L10 18.69l7.74-8.44h-4.99v-8h-5.5v8H2.316zm15.469-.05c-.01 0-.014.007-.012.013l.012-.013z"></path></g><defs><clipPath id="clip0_472_1137"><path d="M0 0h20v20H0z"></path></clipPath></defs></svg>
                    </button>
                    <button className="Post__footer-btn">
                        <svg className="Post__footer-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20" icon-name="comment-outline" fill="currentColor"><path d="M7.725 19.872a.718.718 0 01-.607-.328.725.725 0 01-.118-.397V16H3.625A2.63 2.63 0 011 13.375v-9.75A2.629 2.629 0 013.625 1h12.75A2.63 2.63 0 0119 3.625v9.75A2.63 2.63 0 0116.375 16h-4.161l-4 3.681a.725.725 0 01-.489.191zM3.625 2.25A1.377 1.377 0 002.25 3.625v9.75a1.377 1.377 0 001.375 1.375h4a.625.625 0 01.625.625v2.575l3.3-3.035a.628.628 0 01.424-.165h4.4a1.377 1.377 0 001.375-1.375v-9.75a1.377 1.377 0 00-1.374-1.375H3.625z"></path></svg>
                        {commentCount}
                    </button>
                    <button className="Post__footer-btn">
                        <svg className="Post__footer-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20" icon-name="share-ios-outline" fill="currentColor"><path d="M19 11v5.378A2.625 2.625 0 0116.378 19H3.622A2.625 2.625 0 011 16.378V11h1.25v5.378a1.373 1.373 0 001.372 1.372h12.756a1.373 1.373 0 001.372-1.372V11H19zM9.375 3.009V14h1.25V3.009l2.933 2.933.884-.884-4-4a.624.624 0 00-.884 0l-4 4 .884.884 2.933-2.933z"></path></svg>
                        Share
                    </button>
                </div>
        </div>
    );
}