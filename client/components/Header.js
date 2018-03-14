import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import query from '../queries/CurrentUser';
import mutation from '../mutations/Logout';

import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = { current: '' };
        this.handleClick = (e) => {
            console.log('click', e);
            this.setState({
                current: e.key,
            });
        }
    }
    onLogoutClick() {
        console.log("logging out");
        this.props.mutate({
            refetchQueries: [{ query }]
        });
    }
    renderLinks() {
        const { loading, user } = this.props.data;
        if (loading) { return <div />; }
        if (user) {
            return (
                <Menu onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    theme="dark"
                    style={{ lineHeight: '64px' }}>
                    <Menu.Item key="home">
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="logout">
                        <Link to="/" onClick={this.onLogoutClick.bind(this)}>Logout</Link>
                    </Menu.Item>
                </Menu>
            );
        }
        else {
            return (
                <Menu onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    theme="dark"
                    style={{ lineHeight: '64px' }}>
                    <Menu.Item key="home">
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="signup">
                        <Link to="/signup">Signup</Link>
                    </Menu.Item>
                    <Menu.Item key="login">
                        <Link to="/login">Login</Link>
                    </Menu.Item>
                </Menu>
            );
        }
    }
    render() {
        return (
            <div>
                {this.renderLinks()}
            </div>
        );
    }
}

export default graphql(mutation)(
    graphql(query)(Header)
);