import Link from 'next/link';

import './NewPostButton.css';

export const NewPostButton = () => {
    return (
        <Link href="/submit" className="NewPostButton">
            <span className="NewPostButton__icon">+</span>
            Create a post
        </Link>
    );
}