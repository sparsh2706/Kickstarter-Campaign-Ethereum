import React from 'react';
import Header from './Header';
const Layout = (props) => { // Functional Components gets called with props
    return (
        <div>
            <Header />
            {props.children}
        </div>
    );
};

export default Layout;