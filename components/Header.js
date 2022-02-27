import React from "react";
import { Menu } from "semantic-ui-react";

/* This is a Functional Component */
/* All this Semantic UI specific stuff can be found in its docs */
const Header = () => {
    return (
        
        <Menu style = {{ marginTop: '10px' }}>
            
            <Menu.Item>
                CrowdCoin
            </Menu.Item>
            
            <Menu.Menu position="right">
                <Menu.Item>
                    Campaigns
                </Menu.Item>
                <Menu.Item>
                    +
                </Menu.Item>
            </Menu.Menu>
        
        </Menu>
    );
}

export default Header;

/* Two sets of Curly braces in styles = {{}} means:
    1st Brace: That we are going to write some JS object
    2nd Brace: The actual object

*/