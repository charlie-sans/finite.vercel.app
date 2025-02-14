import React from 'react';
import tileData from '../data/producttiles.json';
import '../styles/App.css'

function Products() {
    return (
        <div className="page-content">
            <h1>Our Products</h1>
            <p>Discover our range of developer tools and services.</p>
            <div className="products-grid">
                <div className="metro-grid">
                    {tileData.tiles.map((tile) => (
                        <a key={tile.id} href={tile.link}>
                        <div key={tile.id} className={`metro-tile ${tile.colorClass}`}>
                            <div className="tile-icon">{tile.icon}</div>
                            <div className="tile-title">{tile.title}</div>
                            <div className="tile-description">{tile.description}</div>
                        </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Products;
