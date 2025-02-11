import React from 'react';
import './ProductPage.css';

const ProductPage = () => {
  return (
    <div className="product-container">
      <header className="product-header">
        <h1>KodeRunner V3</h1>
        <p className="tagline">Your Interactive VSCode-like Environment in Resonite</p>
      </header>

      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>15+ Languages</h3>
            <p>Run code in multiple programming languages through WebSocket connectivity</p>
          </div>
          
          <div className="feature-card">
            <h3>Anywhere Access</h3>
            <p>Code from any location with WebSocket support</p>
          </div>
          <div className="feature-card">
            <h3>VSCode-like Experience</h3>
            <p>Familiar coding environment inside Resonite</p>
          </div>
          <div className="feature-card">
            <h3>Expandable</h3>
            <p>KodeRunner can be expanded with new languages on the fly through dotnets reflection</p>
          </div>
          
        </div>
      </section>

      <section className="get-started">
        <h2>Get Started</h2>
        <div className="requirements">
          <p>Requirements: Dotnet 8 or higher</p>
          <a href="https://dotnet.microsoft.com/download" className="download-btn">
            Download .NET
          </a>
        </div>
        <div className="installation">
            <p>Installation:</p>
            <pre>
                <code>
                git clone https://git.gay/finite/koderunner</code>
                <br />
                <br />
                <code>cd koderunner</code>
                <br />
                <br />
                <code>and run build.sh or build.ps1 for linux and windows respectivly</code>
            </pre>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
