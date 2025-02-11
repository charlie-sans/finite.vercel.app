import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import tileData from './data/tiles.json';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './404';
import ProductPage  from './koderunner/ProductPage';
import Masm from './masm/masm';
import Masm_Docs from './masm/documentation';
function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
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

                <div className="title-bar">
                    <button className="mobile-menu-button" onClick={toggleMenu}>
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                    <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <Link to="/" className="nav-item">Home</Link>
                        <Link to="/products" className="nav-item">Products</Link>
                        <Link to="/">
                            <img src="/logo.png" alt="Finite" className="logo" />
                        </Link>
                        <Link to="/about" className="nav-item">About</Link>
                        <Link to="/contact" className="nav-item">Contact</Link>
                        <Link to="/masm/docs" className="nav-item">Docs</Link>
                        <a href="https://git.gay/finite" className="nav-item" target="_blank" rel="noopener noreferrer">Git.gay</a>
                    </div>
                    <div className="title-bar-left">
                    </div>
                </div>
                
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={
                            <>
                                <div className='Content'>
                                    <h1 className="title">Welcome to Finite</h1>
                                    <p className="description">
                                        A Unorganisation of the Past, Present, and Future.
                                    </p>
                                    <p>From developers around the world, Finite brings you experiences that you will enjoy</p>
                                <p> explore the parts of Finite that provide creativity to players</p>
                                </div>
                                <div className="metro-grid">
                                    {tileData.tiles.map((tile) => (
                                        <a href={tile.link} className="metro-tile-link">
                                        <div key={tile.id} className={`metro-tile ${tile.colorClass}`}>
                                            <div className="tile-icon">{tile.icon}</div>
                                            <div className="tile-title">{tile.title}</div>
                                            <div className="tile-description">{tile.description}</div>
                                        </div>
                                        </a>
                                    ))}
                                </div>
                            </>
                        } />
                        <Route path="/products" element={<Products />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/koderunner" element={<ProductPage />} />
                        <Route path="/masm" element={<Masm />} />
                        <Route path="/masm/docs" element={<Masm_Docs />} />
                        <Route path="*" element={<NotFound/>} />
                    </Routes>
                </div>
                
                <footer className="footer">
                    <p>© 2025 Finite. All rights reserved.</p>
                    {/* <div className="footer-links">
                        <a href="#" className="footer-link">Privacy Policy</a>
                        <a href="#" className="footer-link">Terms of Service</a>
                        <a href="#" className="footer-link">Documentation</a>
                    </div> */}
                </footer>
            </div>
        </Router>
    );
}


export default App;