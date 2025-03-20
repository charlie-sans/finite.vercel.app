import React, { useEffect, useState, Suspense, useRef } from 'react';
import './ProductPage.css';
import { FaCode, FaGlobe, FaLaptopCode, FaLayerGroup } from 'react-icons/fa';

// Lazy load SyntaxHighlighter
const SyntaxHighlighter = React.lazy(() =>
  import('react-syntax-highlighter').then(module => ({
    default: module.Prism,
  }))
);
const vscDarkPlus = React.lazy(() =>
  import('react-syntax-highlighter/dist/esm/styles/prism').then(module => ({
    default: module.vscDarkPlus,
  }))
);

// Custom hook to detect element visibility in viewport
function useElementOnScreen(options) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    }, options);

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
}

// Animated component that applies animation class when visible
const AnimatedElement = ({ children, animationClass, delay = 0 }) => {
  const [ref, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  });
  
  return (
    <div 
      ref={ref} 
      className={`animate-element ${isVisible ? animationClass : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const ProductPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top and mark as loaded
    window.scrollTo(0, 0);
    
    // Small timeout to ensure all resources are loaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading KodeRunner...</p>
      </div>
    );
  }

  return (
    <div className="product-container">
      <div className="hero-section" id="top">
        <AnimatedElement animationClass="fade-right">
          <div className="hero-content">
            <h1>KodeRunner <span className="version">V3</span></h1>
            <p className="tagline">Your Interactive VSCode-like Environment in Resonite</p>
            <div className="hero-buttons">
              <a href="#get-started" className="primary-btn">Get Started</a>
              <a href="https://git.carsoncoder.com/finite/koderunner" className="secondary-btn">View on Git</a>
            </div>
          </div>
        </AnimatedElement>

        <AnimatedElement animationClass="fade-left" delay={200}>
          <div className="hero-image">
            <div className="code-editor-mockup">
              <div className="editor-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="editor-body">
                <Suspense fallback={<div className="loading-code">Loading code...</div>}>
                  <SyntaxHighlighter
                    language="javascript"
                    style={vscDarkPlus}
                    customStyle={{
                      backgroundColor: '#1e1e1e',
                      color: '#ffffff',
                      padding: '1rem',
                      borderRadius: '8px',
                      overflowX: 'auto',
                    }}
                  >
                    {`function hello() {
  console.log("Hello from KodeRunner!");
}`}
                  </SyntaxHighlighter>
                </Suspense>
              </div>
            </div>
          </div>
        </AnimatedElement>
      </div>

      <div className="section-divider"></div>

      <section className="features" id="features">
        <AnimatedElement animationClass="fade-up">
          <h2>Key Features</h2>
        </AnimatedElement>
        
        <div className="feature-grid">
          <AnimatedElement animationClass="zoom-in" delay={100}>
            <div className="feature-card">
              <div className="feature-icon">
                <FaCode />
              </div>
              <h3>15+ Languages</h3>
              <p>Run code in multiple programming languages through WebSocket connectivity</p>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="zoom-in" delay={200}>
            <div className="feature-card">
              <div className="feature-icon">
                <FaGlobe />
              </div>
              <h3>Anywhere Access</h3>
              <p>Code from any location with WebSocket support</p>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="zoom-in" delay={300}>
            <div className="feature-card">
              <div className="feature-icon">
                <FaLaptopCode />
              </div>
              <h3>VSCode-like Experience</h3>
              <p>Familiar coding environment inside Resonite</p>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="zoom-in" delay={400}>
            <div className="feature-card">
              <div className="feature-icon">
                <FaLayerGroup />
              </div>
              <h3>Expandable</h3>
              <p>KodeRunner can be expanded with new languages on the fly through dotnets reflection</p>
            </div>
          </AnimatedElement>
        </div>
      </section>

      <section className="demo-section" id="demo">
        <AnimatedElement animationClass="fade-up">
          <h2>See KodeRunner in Action</h2>
        </AnimatedElement>
        
        <div className="demo-container">
          <AnimatedElement animationClass="fade-right" delay={100}>
            <div className="demo-video">
          
                {/* video from youTUbe */}
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/QRCEpGgVgHc"
                  title="KodeRunner Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '8px' }}
                ></iframe>
             
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="fade-left" delay={200}>
            <div className="demo-text">
              <h3>Seamless Coding Experience</h3>
              <p>Watch how KodeRunner transforms your Resonite experience with real-time code execution and collaboration features.</p>
              <ul className="demo-features">
                <li>Real-time code execution with instant feedback</li>
                <li>Syntax highlighting for all supported languages</li>
              </ul>
            </div>
          </AnimatedElement>
        </div>
      </section>

      <section className="get-started" id="get-started">
        <AnimatedElement animationClass="fade-up">
          <h2>Get Started</h2>
        </AnimatedElement>
        
        <div className="setup-container">
          <AnimatedElement animationClass="fade-up" delay={100}>
            <div className="requirements-card">
              <h3>Requirements</h3>
              <p>Before you begin, make sure you have:</p>
              <ul>
                <li>Dotnet 8 or higher</li>
                <li>Git installed</li>
                <li>Resonite account</li>
              </ul>
              <a href="https://dotnet.microsoft.com/download" className="download-btn">
                Download .NET
              </a>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="fade-up" delay={200}>
            <div className="installation-card">
              <h3>Installation</h3>
              <div className="terminal">
                <div className="terminal-header">
                  <span className="terminal-title">Terminal</span>
                </div>
                <div className="terminal-body">
                  <p><span className="command">git clone</span> https://git.gay/finite/koderunner</p>
                  <p><span className="command">cd</span> koderunner</p>
                  <p><span className="platform-windows">Windows:</span> <span className="command">./build.ps1</span></p>
                  <p><span className="platform-linux">Linux:</span> <span className="command">./build.sh</span></p>
                </div>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>

      <footer className="product-footer">
        <p>KodeRunner is an open-source project by Finite • <a href="https://git.gay/finite/koderunner">View on Git</a></p>
        <p><a href="#top">Back to top</a></p>
      </footer>
    </div>
  );
};

export default ProductPage;
