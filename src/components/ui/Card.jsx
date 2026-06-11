import React from 'react';

export function Card({ children, className = '', style = {} }) {
  return (
    <div className={`card ${className}`} style={{ marginBottom: 0, height: '100%', ...style }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }) {
  return (
    <div className="card-header">
      <h3 style={{ margin: 0 }}>{title}</h3>
      {action && <div className="action-icon">{action}</div>}
    </div>
  );
}
