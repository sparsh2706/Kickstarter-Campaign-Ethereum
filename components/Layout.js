import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
const Layout = (props) => { // Functional Components gets called with props
    return (
        // Adding COntainer to fix up margins
        <Container> 
            <Header />
            {props.children}
        </Container>
    );
};

export default Layout;

/* Layout would be used in all the pages, so its like 
a Maste Blade file */