import Link from 'next/link';

import './Header.scss';

export const Header = () => {
    return (
        <header className='Header'>
            <nav className='Header__nav'>
            <Link href="/" className="Header__logo-link">
                <h1>Dreddit</h1>
            </Link>
            </nav>
        </header>
    );
}
