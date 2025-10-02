import React, { useEffect, useState, Suspense, useRef } from 'react';
import './MicroHighPage.css';
import { FaCode, FaRocket, FaCogs, FaFileCode, FaTerminal, FaBolt, FaPlay, FaCopy, FaStar, FaQuestionCircle, FaChevronDown, FaGithub, FaDiscord, FaBook } from 'react-icons/fa';

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

const MicroHighPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePlayground, setActivePlayground] = useState(0);
  const [playgroundCode, setPlaygroundCode] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

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
        <p>Loading μHigh...</p>
      </div>
    );
  }

  const codeExample = `func main() {
    var greeting = "Hello, μHigh!"
    print(greeting)
    
    var numbers = [1, 2, 3, 4, 5]
    for num in numbers {
        print("Number: " + string(num))
    }
}

class Calculator {
    public func add(a: int, b: int): int {
        return a + b
    }
    
    public func multiply(x: float, y: float): float {
        return x * y
    }
}`;

  const playgroundExamples = [
    {
      title: "Hello World",
      code: `func main() {
    print("Hello, μHigh!")
}`
    },
    {
      title: "Variables & Types",
      code: `func main() {
    var name: string = "μHigh"
    var version = 1.0
    var isAwesome: bool = true
    
    print("Language: " + name)
    print("Version: " + string(version))
    print("Awesome: " + string(isAwesome))
}`
    },
    {
      title: "Classes & Objects",
      code: `class Person {
    private field name: string
    private field age: int
    
    public func init(name: string, age: int) {
        this.name = name
        this.age = age
    }
    
    public func greet() {
        print("Hi, I'm " + this.name + 
              " and I'm " + string(this.age) + " years old!")
    }
}

func main() {
    var person = new Person("Alice", 25)
    person.greet()
}`
    }
  ];

  const testimonials = [
   
  ];

  const faqItems = [
    {
      question: "What makes μHigh different from Go?",
      answer: "While μHigh uses Go-like syntax, it adds full object-oriented programming with classes, properties, and inheritance. It also includes inline assembly support and compiles to bytecode for different execution models."
    },
    {
      question: "Is μHigh suitable for beginners?",
      answer: "Absolutely! μHigh was designed with clean, readable syntax that's easy to learn. The strong type system helps catch errors early, making it great for learning programming fundamentals."
    },
    {
      question: "Can I use μHigh for production applications?",
      answer: "μHigh is actively developed and suitable for various applications. However, as with any language, we recommend thorough testing for production use cases."
    },
    {
      question: "How do I contribute to μHigh development?",
      answer: "We welcome contributions! Check out our documentation for development guidelines, or join our community channels to discuss ideas and improvements."
    }
  ];




  return (
    <div className="product-container">
      <div className="hero-section" id="top">
        <AnimatedElement animationClass="fade-right">
          <div className="hero-content">
            <h1>μHigh <span className="version">Language</span></h1>
            <p className="tagline">A Modern Programming Language with Go-like Syntax</p>
            <div className="hero-buttons">
              <a href="#get-started" className="primary-btn">Get Started</a>
              <a href="#documentation" className="secondary-btn">View Documentation</a>
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
                <span className="editor-title">hello.uh</span>
              </div>
              <div className="editor-body">
                <Suspense fallback={
                  <div className="loading-code">
                    <pre style={{ color: '#ffffff', fontFamily: 'monospace', backgroundColor: '#1e1e1e', padding: '1rem', borderRadius: '4px' }}>
                      {codeExample}
                    </pre>
                  </div>
                }>
                  <SyntaxHighlighter
                    language="go"
                    customStyle={{
                      backgroundColor: '#1e1e1e',
                      padding: '1rem',
                      borderRadius: '8px',
                      overflowX: 'auto',
                      margin: 0
                    }}
                  >
                    {codeExample}
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
              <h3>Go-like Syntax</h3>
              <p>Clean, readable syntax inspired by Go with modern language features</p>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="zoom-in" delay={200}>
            <div className="feature-card">
              <div className="feature-icon">
                <FaRocket />
              </div>
              <h3>Fast Compilation</h3>
              <p>Quick compilation to efficient bytecode for rapid development cycles</p>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="zoom-in" delay={300}>
            <div className="feature-card">
              <div className="feature-icon">
                <FaCogs />
              </div>
              <h3>Object-Oriented</h3>
              <p>Full OOP support with classes, properties, fields, and inheritance</p>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animationClass="zoom-in" delay={400}>
            <div className="feature-card">
              <div className="feature-icon">
                <FaFileCode />
              </div>
              <h3>Type Safety</h3>
              <p>Optional static typing with type inference for safer code</p>
            </div>
          </AnimatedElement>
          
 
          
          <AnimatedElement animationClass="zoom-in" delay={600}>
            <div className="feature-card">
              <div className="feature-icon">
                <FaBolt />
              </div>
              <h3>Modern Features</h3>
              <p>Error handling, generics, lambda functions, and more</p>
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
              <p>To start developing with μHigh:</p>
              <ul>
                <li>μHigh Compiler (part of the μHigh toolkit)</li>
                <li>Text editor or IDE with syntax highlighting</li>
                <li>Basic understanding of programming concepts</li>
              </ul>
            </div>
          </AnimatedElement>
          
          
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <AnimatedElement animationClass="fade-up">
          <h2>Frequently Asked Questions</h2>
        </AnimatedElement>
        
        <div className="faq-container">
          {faqItems.map((item, index) => (
            <AnimatedElement key={index} animationClass="fade-up" delay={index * 100}>
              <div className="faq-item">
                <button
                  className={`faq-question ${expandedFAQ === index ? 'expanded' : ''}`}
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <FaQuestionCircle className="faq-icon" />
                  {item.question}
                  <FaChevronDown className={`chevron ${expandedFAQ === index ? 'rotated' : ''}`} />
                </button>
                <div className={`faq-answer ${expandedFAQ === index ? 'expanded' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section" id="community">
        <AnimatedElement animationClass="fade-up">
          <h2>Join the Community</h2>
          <p>Connect with other μHigh developers and stay updated</p>
        </AnimatedElement>
        
        <div className="community-links">
          <AnimatedElement animationClass="zoom-in" delay={100}>
            <a href="#" className="community-link">
              <FaGithub />
              <span>GitHub</span>
              <p>Contribute to the project</p>
            </a>
          </AnimatedElement>
          
          <AnimatedElement animationClass="zoom-in" delay={200}>
            <a href="#" className="community-link">
              <FaDiscord />
              <span>Discord</span>
              <p>Chat with the community</p>
            </a>
          </AnimatedElement>
          
          <AnimatedElement animationClass="zoom-in" delay={300}>
            <a href="#" className="community-link">
              <FaBook />
              <span>Documentation</span>
              <p>Learn and reference</p>
            </a>
          </AnimatedElement>
        </div>
      </section>

      <footer className="product-footer">
        <p>μHigh is part of the Finite ecosystem • <a href="/docs">View Documentation</a></p>
        <p><a href="#top">Back to top</a></p>
      </footer>
    </div>
  );
};

export default MicroHighPage;
