import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';
import tileData from './data/tiles.json';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/404';
import ProductPage  from './pages/koderunner/ProductPage';
import Masm from './pages/masm/masm';
import Docs from './pages/docs/documentation';

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
            <>
                {/* Add the star background */}
                <div className="star-background"></div>
                
                <div className="App">
                    {/* meta tags for logo name and description */}

                    <meta name="title" content="Finite" />
                    <meta name="description" content="A Unorganisation of the Past, Present, and Future." />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://fynite.vercel.app/" />
                    <meta property="og:title" content="Finite" />
                    <meta property="og:description" content="A Unorganisation of the Past, Present, and Future." />
                    <meta property="og:image" content="/logo.png" />

                    <header className="title-bar">
                        <button className="mobile-menu-button" onClick={toggleMenu}>
                            {isMenuOpen ? '✕' : '☰'}
                        </button>
                        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                            <Link to="/" className="nav-item">Home</Link>
                            <Link to="/products" className="nav-item">Products</Link>
                            <Link to="/about" className="nav-item">About</Link>
                            <Link to="/">
                                <img src="/logo.png" alt="Finite" className="logo" />
                            </Link>
                            <Link to="/contact" className="nav-item">Contact</Link>
                            <Link to="/docs" className="nav-item">Docs</Link>
                            <a href="https://git.gay/finite" className="nav-item" target="_blank" rel="noopener noreferrer">Git.gay</a>
                        </div>
                        <div className="title-bar-left">
                        </div>
                    </header>
                    
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={
                                <>
                                    <div className='Content'>
                                        <h1 className="title">Welcome to Finite</h1>
                                        <p className="description">
                                            A Unorganisation of the Past, Present, and Future.
                                        </p>
                                        <p>From developers around the world, Finite brings you experiences that you will enjoy</p>
                                        <p>Explore the parts of Finite that provide creativity to players</p>
                                    </div>
                                    <div className="metro-grid">
                                        {tileData.tiles.map((tile) => (
                                            <a href={tile.link} className="metro-tile-link" key={tile.id}>
                                                <div className={`metro-tile ${tile.colorClass}`}>
                                                    <div className="tile-icon">{tile.icon}</div>
                                                    <div className="tile-title">{tile.title}</div>
                                                    <div className="tile-description">{tile.description}</div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    <section className="mission-vision">
                                        <h2>Our Mission & Vision</h2>
                                        <p>At Finite, our mission is to innovate and inspire through technology. We envision a world where creativity and technology merge seamlessly to create unforgettable experiences.</p>
                                    </section>
                                    <section className="projects">
                                        <h2>Our Projects</h2>
                                        <div className="projects-grid">
                                            {/* Add project details here */}
                                            <div className="metro-grid">
                                                                                {tileData.tiles.map((tile) => (
                                                                                    <a href={tile.link} className="metro-tile-link" key={tile.id}>
                                                                                        <div className={`metro-tile ${tile.colorClass}`}>
                                                                                            <div className="tile-icon">{tile.icon}</div>
                                                                                            <div className="tile-title">{tile.title}</div>
                                                                                            <div className="tile-description">{tile.description}</div>
                                                                                        </div>
                                                                                    </a>
                                                                                ))}
                                                                            </div>
                                        
                                        </div>
                                    </section>
                                    <section className="team">
                                        <h2>Meet the Team</h2>
                                        <div className="team-grid">
                                      
                                            <div className="team-member">
                                                <h3>Charlie-san</h3>
                                                <img src="/avatars/charlie.jpeg" alt="Charlie-san" style={{ width: '120px', height: '120px' }} />
                                                <p>the owner and founder of finite! lead developer who works on pretty much everything</p>
                                            </div>
                                            <div className="team-member">
                                                <h3>techy89</h3>
                                                <img src="/avatars/techy.webp" alt="techy89" />
                                                <p>another lead maintainer that does cursed things with git to help the team</p>
                                            </div>
                                            <div className="team-member">
                                                <h3>Carson-Coder</h3>
                                                <img src="/avatars/carson.webp" alt="carson coder" />
                                                <p>the third lead developer who also maintains the PyMasm interpreter</p>
                                        </div>
                                        </div>
                                    </section>
                                </>
                            } />
                            <Route path="/products" element={<Products />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/koderunner" element={<ProductPage />} />
                            <Route path="/masm" element={<Masm />} />
                            <Route path="/docs" element={<Docs />} />
                            <Route path="*" element={<NotFound/>} />
                        </Routes>
                    </main>
                    
                    <footer className="footer">
                        <p>© 2025 Finite. All rights reserved.</p>
                        <div className="footer-links">

                            <Link to="/docs" className="footer-link">Documentation</Link>
                        </div>
                    </footer>
                </div>
            </>
        </Router>
    );
}

export default App;