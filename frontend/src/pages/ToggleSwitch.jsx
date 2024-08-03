import React from 'react';
import './CSS/ToggleSwitch.css';

const ToggleSwitch = ({ isChecked, onChange }) => {
    return (
        <label className="switch">
            <input 
                type="checkbox" 
                checked={isChecked} 
                onChange={onChange} 
            />
            <span className="slider"></span>
        </label>
    );
};

export default ToggleSwitch;
