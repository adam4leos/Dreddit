import './Header.scss';

export const Header = () => {
    return (
        <header className='Header'>
            <nav className='Header__nav'>
                <a href="/" className='Header__logo-link'><h1>Dreddit</h1></a>
            </nav>
        </header>
    );
}
