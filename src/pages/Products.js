import React from 'react';
import tileData from '../data/producttiles.json';
import '../App.css'

function Products() {
    return (
        <div className="page-content">
            <h1>Our Products</h1>
            <p>Discover our range of developer tools and services.</p>
            <div className="products-grid">
                <div className="metro-grid">
                    {tileData.tiles.map((tile) => (
                        <div key={tile.id} className={`metro-tile ${tile.colorClass}`}>
                            <div className="tile-icon">{tile.icon}</div>
                            <div className="tile-title">{tile.title}</div>
                            <div className="tile-description">{tile.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Products;
