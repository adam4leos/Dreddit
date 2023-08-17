import Link from 'next/link';

import './NewPostButton.scss';

export const NewPostButton = () => {
    return (
        <Link href="/submit" className="NewPostButton">
            <span className="NewPostButton__icon">+</span>
            Create a post
        </Link>
    );
}