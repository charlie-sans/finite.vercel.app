import React from 'react';
import '../styles/ProductPage.css';  // Update the import path

const Masm = () => {  // Capitalize component name for React convention
  const features = [
    {
      title: 'Educational-First Design',
      description: 'A simplified assembly language perfect for learning low-level programming concepts',
      icon: '🎓'
    },
    {
      title: 'Cross-Platform Support',
      description: 'Run MicroASM programs on any platform with our Python, Java, or ProtoFlux interpreters',
      icon: '💻'
    },
    {
      title: 'Interactive Debugger',
      description: 'Step through code, inspect registers, and understand program flow with our built-in debugger',
      icon: '🔍'
    },
    {
      title: 'Resonite Integration',
      description: 'Create programs and devices directly in Resonite using the MicroASM interpreter',
      icon: '🎮'
    }
  ];

  const codeExample = `LBL main
    MOV RAX 5    ; Set RAX to 5
    MOV RBX 10   ; Set RBX to 10
    ADD RAX RBX  ; Add RBX to RAX
    CALL #printf RAX  ; Print result
    HLT          ; Stop program`;

  return (
    <div className="page-content product-page">  // Add page-content class
      <header className="hero">
        <h1>MicroASM</h1>
        <p className="tagline">A Modern Educational Assembly Language</p>
      </header>

      <section className="overview">
        <h2>What is MicroASM?</h2>
        <p>
          MicroASM is a fantasy-based Reduced Instruction Set version of x86 Assembly,
          designed for education and virtual machine interpretation. Perfect for learning
          assembly concepts without the complexity of traditional assembly languages.
        </p>
      </section>

      <section className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="code-preview">
        <h2>Simple, Intuitive Syntax</h2>
        <pre>
          <code>{codeExample}</code>
        </pre>
      </section>

      <section className="tooling">
        <h2>Comprehensive Tooling</h2>
        <div className="tools-grid">
          <div className="tool">
            <h3>CMASM Compiler</h3>
            <p>Convert your MicroASM code to efficient machine code</p>
          </div>
          <div className="tool">
            <h3>JMASM interpreter</h3>
            <p>Run MicroAssembly on the jvm</p>
          </div>
          <div className="tool">
            <h3>Javascript interpreter</h3>
            <p>Run MicroAssembly on the web</p>
          </div>

          <div className="tool">
            <h3>Python interpreter</h3>
            <p>Run MicroAssembly through Python with our interpreter</p>
          </div>
          <div className="tool">
            <h3>Interactive Debugger</h3>
            <p>Debug with ease using our ncurses-based interface</p>
          </div>
          <div className="tool">
            <h3>Documentation</h3>
            <p>Extensive docs and examples to get you started</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <div className="cta-buttons">
          <a href="/masm/docs" className="btn btn-primary">Documentation</a>
          <a href="https://git.gay/finite/MicroASM" className="btn btn-secondary">View Source</a>
          {/* <a href="/playground" className="btn btn-secondary">Try Online</a> */}
        </div>
      </section>

      <footer className="product-footer">
        <p>
          MicroASM is open source and available under the MIT license. 
          <a href="https://git.gay/finite/MicroASM">View on Git.gay</a>
        </p>
      </footer>
    </div>
  );
};

export default Masm;  // Capitalize the export name