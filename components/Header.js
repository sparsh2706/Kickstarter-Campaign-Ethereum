import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from '../routes';

/* This is a Functional Component */
/* All this Semantic UI specific stuff can be found in its docs */
const Header = () => {
    return (
        
        <Menu style = {{ marginTop: '10px' }}>
            
            <Link route="/">
                <a className="item">
                    CrowdCoin
                </a>
            </Link>
            
            <Menu.Menu position="right">
                <Link route="/">
                    <a className="item">
                        Campaigns
                    </a>
                </Link>

                <Link route="/campaigns/new">
                    <a className="item">
                        +
                    </a>
                </Link>
            </Menu.Menu>
        
        </Menu>
    );
}

export default Header;

/* Since Menu.Item Tag and Link Tag Styling Component looks kinda similar
and it would mess up the CSS of the website. We might as well remove Menu.item */

/* Two sets of Curly braces in styles = {{}} means:
    1st Brace: That we are going to write some JS object
    2nd Brace: The actual object
*/
