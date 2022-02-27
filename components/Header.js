import React from "react";
import { Menu } from "semantic-ui-react";

/* This is a Functional Component */
/* All this Semantic UI specific stuff can be found in its docs */
const Header = () => {
    return (
        <Menu>
            
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