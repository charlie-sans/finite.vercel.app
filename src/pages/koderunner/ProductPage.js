import React, { useEffect, useState, Suspense, useRef } from 'react';
import './ProductPage.css';
import { FaCode, FaGlobe, FaLaptopCode, FaLayerGroup, FaPython, FaJsSquare, FaJava, FaRust, FaCogs, FaTachometerAlt, FaUsers, FaDownload } from 'react-icons/fa';
import {  SiGo, SiKotlin, SiSwift, SiTypescript } from 'react-icons/si';

// Lazy load SyntaxHighlighter with both component and styles
const SyntaxHighlighter = React.lazy(() =>
  Promise.all([
    import('react-syntax-highlighter'),
    import('react-syntax-highlighter/dist/esm/styles/prism')
  ]).then(([syntaxModule, styleModule]) => ({
    default: ({ children, language, style, customStyle, ...props }) => {
      const { Prism } = syntaxModule;
      const vscDarkPlus = styleModule.vscDarkPlus;
      
      return (
        <Prism
          language={language}
          style={style || vscDarkPlus}
          customStyle={customStyle}
          {...props}
        >
          {children}
        </Prism>
      );
    }
  }))
);

// Custom hook to detect element visibility in viewport
function useElementOnScreen(options) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasBeenSeen) {
        setIsVisible(true);
        setHasBeenSeen(true);
      }
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
  }, [containerRef, options, hasBeenSeen]);

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
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [stats, setStats] = useState({
    executions: 0,
    languages: 15,
    users: 0
  });

  useEffect(() => {
    // Scroll to top and mark as loaded
    window.scrollTo(0, 0);
    
    // Small timeout to ensure all resources are loaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Animate stats on component mount
  useEffect(() => {
    if (isLoaded) {
      const animateStats = () => {
        const targets = { executions: 50000, users: 1200 };
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          
          setStats({
            executions: Math.floor(targets.executions * progress),
            languages: 15,
            users: Math.floor(targets.users * progress)
          });
          
          if (step >= steps) {
            clearInterval(timer);
          }
        }, stepDuration);
        
        return () => clearInterval(timer);
      };
      
      setTimeout(animateStats, 500);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading KodeRunner...</p>
      </div>
    );
  }

  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript', icon: FaJsSquare, color: '#f7df1e' },
    { id: 'python', name: 'Python', icon: FaPython, color: '#3776ab' },
    { id: 'java', name: 'Java', icon: FaJava, color: '#ed8b00' },

    { id: 'go', name: 'Go', icon: SiGo, color: '#00add8' },
    { id: 'rust', name: 'Rust', icon: FaRust, color: '#dea584' },
    { id: 'typescript', name: 'TypeScript', icon: SiTypescript, color: '#3178c6' },
    { id: 'kotlin', name: 'Kotlin', icon: SiKotlin, color: '#7f52ff' }
  ];

  const codeExamples = {
    javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));`,
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"Fibonacci(10): {fibonacci(10)}")`,
    java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println("Fibonacci(10): " + fibonacci(10));
    }
}`,
    csharp: `using System;

class Program {
    static int Fibonacci(int n) {
        if (n <= 1) return n;
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }
    
    static void Main() {
        Console.WriteLine($"Fibonacci(10): {Fibonacci(10)}");
    }
}`
  };

  const performanceMetrics = [
    { label: 'Average Execution Time for a console project', value: '< 2s', icon: FaTachometerAlt },
    { label: 'Concurrent Users', value: '500+', icon: FaUsers },
    { label: 'Code Executions/Day', value: '10k+', icon: FaCode },
    { label: 'Uptime', value: '99.9%', icon: FaCogs }
  ];

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
                <Suspense fallback={
                  <div className="loading-code">
                  
                  </div>
                }>
                  <SyntaxHighlighter
                    language="javascript"
             
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

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <AnimatedElement animationClass="fade-up" delay={100}>
            <div className="stat-item">
              <div className="stat-number">{stats.executions.toLocaleString()}+</div>
              <div className="stat-label">Code Executions</div>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="fade-up" delay={200}>
            <div className="stat-item">
              <div className="stat-number">{stats.languages}</div>
              <div className="stat-label">Programming Languages</div>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="fade-up" delay={300}>
            <div className="stat-item">
              <div className="stat-number">{stats.users.toLocaleString()}+</div>
              <div className="stat-label">Active Users</div>
            </div>
          </AnimatedElement>
        </div>
      </section>

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

      {/* Language Showcase */}
      <section className="language-showcase" id="languages">
        <AnimatedElement animationClass="fade-up">
          <h2>Supported Languages</h2>
          <p>Run code in 15+ programming languages with WebSocket connectivity</p>
        </AnimatedElement>
        
        <div className="language-selector">
          {supportedLanguages.map((lang, index) => (
            <AnimatedElement key={lang.id} animationClass="zoom-in" delay={index * 50}>
              <button
                className={`language-btn ${selectedLanguage === lang.id ? 'active' : ''}`}
                onClick={() => setSelectedLanguage(lang.id)}
                style={{ '--accent-color': lang.color }}
              >
                <lang.icon />
                {lang.name}
              </button>
            </AnimatedElement>
          ))}
        </div>
        
        <AnimatedElement animationClass="fade-up" delay={400}>
          <div className="language-demo">
            <div className="demo-header">
              <span>Example: Fibonacci in {supportedLanguages.find(l => l.id === selectedLanguage)?.name}</span>
            </div>
            <div className="demo-code">
              <Suspense fallback={
                <div className="loading-code">
                  <pre style={{ color: '#ffffff', fontFamily: 'monospace' }}>
                    {codeExamples[selectedLanguage] || codeExamples.javascript}
                  </pre>
                </div>
              }>
                <SyntaxHighlighter 
                  language={selectedLanguage} 
                  customStyle={{
                    backgroundColor: 'transparent',
                    padding: '1.5rem',
                    margin: 0
                  }}
                >
                  {codeExamples[selectedLanguage] || codeExamples.javascript}
                </SyntaxHighlighter>
              </Suspense>
            </div>
          </div>
        </AnimatedElement>
      </section>

      {/* Performance Metrics */}
      <section className="performance-section" id="performance">
        <AnimatedElement animationClass="fade-up">
          <h2>Performance & Reliability</h2>
        </AnimatedElement>
        
        <div className="metrics-grid">
          {performanceMetrics.map((metric, index) => (
            <AnimatedElement key={index} animationClass="zoom-in" delay={index * 100}>
              <div className="metric-card">
                <div className="metric-icon">
                  <metric.icon />
                </div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            </AnimatedElement>
          ))}
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

      {/* Enhanced Get Started with Downloads */}
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
              <div className="download-buttons">
                <a href="https://dotnet.microsoft.com/download" className="download-btn primary">
                  <FaDownload /> Download .NET
                </a>
                <a href="https://git-scm.com/downloads" className="download-btn secondary">
                  <FaDownload /> Get Git
                </a>
              </div>
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
        
        <AnimatedElement animationClass="fade-up" delay={400}>
          <div className="quick-start-tips">
            <h3>Quick Start Tips</h3>
            <div className="tips-grid">
              <div className="tip-item">
                <FaCode />
                <span>Start with the JavaScript examples for quick testing</span>
              </div>
              <div className="tip-item">
                <FaGlobe />
                <span>Ensure stable internet connection for WebSocket</span>
              </div>
              <div className="tip-item">
                <FaLaptopCode />
                <span>Use the built-in syntax highlighting for better coding</span>
              </div>
            </div>
          </div>
        </AnimatedElement>
      </section>

      <footer className="product-footer">
        <p>KodeRunner is an open-source project by Finite • <a href="https://git.gay/finite/koderunner">View on Git</a></p>
        <p><a href="#top">Back to top</a></p>
      </footer>
    </div>
  );
};

export default ProductPage;
