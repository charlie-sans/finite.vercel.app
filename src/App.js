import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';
import tileData from './data/tiles.json';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/404';
import ProductPage  from './pages/koderunner/ProductPage';
import MicroHighPage from './pages/microhigh/MicroHighPage';
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
                            <a href="https://github.com/fy-nite" className="nav-item" target="_blank" rel="noopener noreferrer">our github</a>
                        </div>
                        <div className="title-bar-left">
                        </div>
                    </header>
                    
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={
                                <>
                                    <section className="hero-section">
                                        {/* Floating particles */}
                                        <div className="floating-particles">
                                            <div className="particle particle-1">⚡</div>
                                            <div className="particle particle-2">🚀</div>
                                            <div className="particle particle-3">💫</div>
                                            <div className="particle particle-4">⭐</div>
                                            <div className="particle particle-5">🔧</div>
                                            <div className="particle particle-6">💻</div>
                                        </div>
                                        
                                        {/* Animated background shapes */}
                                        <div className="hero-bg-shapes">
                                            <div className="shape shape-1"></div>
                                            <div className="shape shape-2"></div>
                                            <div className="shape shape-3"></div>
                                        </div>

                                        <div className="hero-content">
                                            <h1 className="title">Finite</h1>
                                            <p className="description">
                                                Crafting the future of developer experiences
                                            </p>
                                            <p>We build powerful, intuitive tools that bridge the gap between imagination and implementation. From assembly languages to interactive development environments, our ecosystem empowers creators to push boundaries.</p>
                                            <p>Join thousands of developers who trust Finite tools to bring their ideas to life.</p>
                                            
                                            {/* Add interactive stats */}
                                            <div className="hero-stats">
                                                <div className="stat-item">
                                                    <span className="stat-number">3</span>
                                                    <span className="stat-label">Powerful Tools</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-number">1000+</span>
                                                    <span className="stat-label">Developers</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-number">100%</span>
                                                    <span className="stat-label">Open Source</span>
                                                </div>
                                            </div>
                                            
                                            {/* Add call-to-action buttons */}
                                            <div className="hero-cta">
                                                <a href="/docs" className="cta-button primary-cta">
                                                    <span>Get Started</span>
                                                    <div className="cta-icon">→</div>
                                                </a>
                                                <a href="https://github.com/fy-nite" className="cta-button secondary-cta">
                                                    <span>View GitHub</span>
                                                    <div className="cta-icon">★</div>
                                                </a>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="projects content-section" style={{ background: 'linear-gradient(135deg, rgba(255,87,51,0.1) 0%, rgba(255,154,0,0.05) 100%)' }}>
                                        <h2 style={{ color: '#ff5733' }}>Our Developer Ecosystem</h2>
                                        <p style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.9, marginBottom: '3rem' }}>
                                            Three powerful tools designed to enhance your development workflow
                                        </p>
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
                                    </section>

                                    <section className="mission-vision content-section" style={{ background: 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(139,195,74,0.05) 100%)' }}>
                                        <h2 style={{ color: '#4caf50' }}>Our Mission</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                                            <div style={{ 
                                                background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)', 
                                                padding: '2rem', 
                                                borderRadius: '8px', 
                                                color: 'white',
                                                boxShadow: '0 8px 25px rgba(233, 30, 99, 0.3)',
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                            }}>
                                                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Innovation First</h3>
                                                <p>We believe in pushing the boundaries of what's possible in developer tooling, creating solutions that don't just solve problems but inspire new ways of thinking.</p>
                                            </div>
                                            <div style={{ 
                                                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', 
                                                padding: '2rem', 
                                                borderRadius: '8px', 
                                                color: 'white',
                                                boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)',
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                            }}>
                                                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Community Driven</h3>
                                                <p>Our tools are built with and for the developer community. Every feature, every optimization comes from real-world needs and feedback.</p>
                                            </div>
                                            <div style={{ 
                                                background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', 
                                                padding: '2rem', 
                                                borderRadius: '8px', 
                                                color: 'white',
                                                boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)',
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                            }}>
                                                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Open Source</h3>
                                                <p>Transparency and collaboration are at our core. All our projects are open source, fostering innovation and trust within the community.</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="team content-section" style={{ background: 'linear-gradient(135deg, rgba(103,58,183,0.1) 0%, rgba(156,39,176,0.05) 100%)' }}>
                                        <h2 style={{ color: '#673ab7' }}>The Creators</h2>
                                        <p style={{ textAlign: 'center', fontSize: '1.1rem', opacity: 0.9, marginBottom: '3rem' }}>
                                            Meet the passionate developers behind Finite's innovative tools
                                        </p>
                                        <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                            <div className="team-member" style={{ 
                                                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', 
                                                padding: '2rem', 
                                                borderRadius: '12px', 
                                                color: 'white', 
                                                textAlign: 'center',
                                                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                                                transition: 'transform 0.3s ease'
                                            }}>
                                                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Charlie-san</h3>
                                                <img src="/avatars/charlie.jpeg" alt="Charlie-san" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', border: '3px solid white' }} />
                                                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Founder & Lead Developer</p>
                                                <p>Visionary behind Finite's ecosystem. Specializes in language design and cross-platform development, bringing years of experience in creating developer-first solutions.</p>
                                            </div>
                                            <div className="team-member" style={{ 
                                                background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', 
                                                padding: '2rem', 
                                                borderRadius: '12px', 
                                                color: 'white', 
                                                textAlign: 'center',
                                                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                                                transition: 'transform 0.3s ease'
                                            }}>
                                                <h3 style={{ color: 'white', marginBottom: '1rem' }}>techy89</h3>
                                                <img src="/avatars/techy.webp" alt="techy89" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', border: '3px solid white' }} />
                                                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Lead Maintainer & Git Wizard</p>
                                                <p>Master of version control and project architecture. Ensures our codebase stays clean, scalable, and contributor-friendly through innovative Git workflows.</p>
                                            </div>
                                            <div className="team-member" style={{ 
                                                background: 'linear-gradient(135deg, #ff5722 0%, #d84315 100%)', 
                                                padding: '2rem', 
                                                borderRadius: '12px', 
                                                color: 'white', 
                                                textAlign: 'center',
                                                boxShadow: '0 8px 25px rgba(255, 87, 34, 0.3)',
                                                transition: 'transform 0.3s ease'
                                            }}>
                                                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Carson-Coder</h3>
                                                <img src="/avatars/carson.webp" alt="carson coder" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', border: '3px solid white' }} />
                                                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Python Specialist & Core Developer</p>
                                                <p>Drives the PyMasm interpreter and focuses on performance optimization. Passionate about making assembly programming accessible to everyone.</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="content-section" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(255,235,59,0.05) 100%)' }}>
                                        <h2 style={{ color: '#ffc107' }}>Ready to Build Something Amazing?</h2>
                                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
                                            Explore our tools, contribute to our projects, or get in touch with our team
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <a href="/docs" style={{ 
                                                padding: '1rem 2rem', 
                                                background: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 100%)', 
                                                color: 'white', 
                                                borderRadius: '8px', 
                                                textDecoration: 'none', 
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 5px 15px rgba(0, 188, 212, 0.4)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                Explore Documentation
                                            </a>
                                            <a href="https://github.com/fy-nite" style={{ 
                                                padding: '1rem 2rem', 
                                                background: 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)', 
                                                color: 'white', 
                                                borderRadius: '8px', 
                                                textDecoration: 'none', 
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 5px 15px rgba(96, 125, 139, 0.4)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                View on GitHub
                                            </a>
                                        </div>
                                    </section>
                                </>
                            } />
                            <Route path="/products" element={<Products />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/koderunner" element={<ProductPage />} />
                            <Route path="/microhigh" element={<MicroHighPage />} />
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