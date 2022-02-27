import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
const Layout = (props) => { // Functional Components gets called with props
    return (
        // Adding COntainer to fix up margins
        <Container> 
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            </Head>
            <Header />
            {props.children}
        </Container>
    );
};

export default Layout;


/* Everything inside the Head Tag of Nextjs would lead
it to write the bunch of code inside it in the HTML
Head tag <head> */

/* Layout would be used in all the pages, so its like 
a Maste Blade file */