import React, { useEffect, useState, Suspense, useRef } from 'react';
import './MasmPage.css';
import { FaCode, FaLaptopCode, FaCogs, FaRocket } from 'react-icons/fa';

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

const Masm = () => {
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

  const features = [
    {
      title: 'Cross-Platform Support',
      description: 'Run MicroASM programs on any platform with our CSharp, Java, or ProtoFlux interpreters',
      icon: <FaLaptopCode />
    },
    {
      title: 'Interactive Debugger',
      description: 'Step through code, inspect registers, and understand program flow with our built-in debugger',
      icon: <FaCode />
    },
    {
      title: 'Native integration',
      description: 'Write Java, Csharp, Python or Protoflux to use with MicroASM via our Custom Native interface',
      icon: <FaCogs />
    },
    {
      title: 'Resonite Integration',
      description: 'Create programs and devices directly in Resonite using the MicroASM interpreter',
      icon: <FaRocket />
    }
  ];

  const codeExample = `#include "stdio.print"
lbl main
  mov RAX 1
  mov RBX 100
  db $100 "Hello, World!\\n"
  call #printf
hlt`;

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Micro-Assembly...</p>
      </div>
    );
  }

  return (
    <div className="product-container masm-container">
      <div className="star-background"></div>
      
      <div className="hero-section" id="top">
        <AnimatedElement animationClass="fade-right">
          <div className="hero-content">
            <h1>Micro-Assembly</h1>
            <p className="tagline">Navigating the cosmos of computation</p>
            <div className="hero-buttons">
              <a href="#get-started" className="primary-btn">Documentation</a>
              <a href="https://git.gay/finite/MicroASM" className="secondary-btn">View Source</a>
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
                <pre>
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>
          </div>
        </AnimatedElement>
      </div>

      <section className="overview-section" id="overview">
        <AnimatedElement animationClass="fade-up">
          <div className="overview-card">
            <h2>What is Micro-Assembly?</h2>
            <p>
              Micro-Assembly is a High level "Reduced instruction set" assembly like language you love.
              Designed for Creative tasks, general use and educational purposes.
              It is simple and easy to learn, while still providing
              the power and flexibility of a Programming language.
            </p>
          </div>
        </AnimatedElement>
      </section>

      <section className="features" id="features">
        <AnimatedElement animationClass="fade-up">
          <h2>Key Features</h2>
        </AnimatedElement>
        
        <div className="feature-grid">
          {features.map((feature, index) => (
            <AnimatedElement key={index} animationClass="zoom-in" delay={index * 100 + 100}>
              <div className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </section>

      <section className="code-preview-section" id="preview">
        <AnimatedElement animationClass="fade-up">
          <h2>Simple, Intuitive Syntax</h2>
          <div className="code-preview">
            <pre>
              <code>{codeExample}</code>
            </pre>
          </div>
        </AnimatedElement>
      </section>

      <section className="tooling-section" id="tooling">
        <AnimatedElement animationClass="fade-up">
          <h2>Comprehensive Tooling</h2>
        </AnimatedElement>
        
        <div className="tools-grid">
          <AnimatedElement animationClass="fade-up" delay={100}>
            <div className="tool-card">
              <h3>Sharp-MASM</h3>
              <p>Run Micro-Assembly on the dotnet platform</p>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="fade-up" delay={200}>
            <div className="tool-card">
              <h3>JMASM interpreter</h3>
              <p>Run Micro-Assembly on the Java Virtual Machine</p>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="fade-up" delay={300}>
            <div className="tool-card">
              <h3>Interactive Debugger</h3>
              <p>Debug with ease using our Debuggers dedicated to each platform</p>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="fade-up" delay={400}>
            <div className="tool-card">
              <h3>Documentation</h3>
              <p>Extensive docs and examples to get you started*</p>
            </div>
          </AnimatedElement>
        </div>
      </section>

      <section className="get-started" id="get-started">
        <AnimatedElement animationClass="fade-up">
          <h2>Ready to Explore the Universe of Micro-Assembly?</h2>
          <div className="cta-buttons">
            <a href="/docs" className="primary-btn">Documentation</a>
            <a href="https://git.gay/finite/MicroASM" className="secondary-btn">View Source</a>
            <a href="https://github.com/Fy-nite" className="secondary-btn">GitHub Mirror</a>
          </div>
        </AnimatedElement>
      </section>

      <footer className="product-footer">
        <p>
          MicroASM is open source and available under the MIT license.
          <a href="https://git.carsoncoder.com/finite/MicroASM">View the source code</a>.
        </p>
        <p><small>* Note: not everything is finished and documentation will take a big hit because of this, if anything arrises. please make a git issue at our official Git repo <a href='https://git.carsoncoder.com/Finite/Micro-Assembly'>MicroASM</a></small></p>
        <p><a href="#top">Back to top</a></p>
      </footer>
    </div>
  );
};

export default Masm;