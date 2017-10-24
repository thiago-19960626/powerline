import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Content, Container, Title, Text, Button, List, Icon, ListItem, Left, Body, Right, Thumbnail, Header, Tabs, Tab } from 'native-base';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';

const PLColors = require('PLColors');
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');
import styles from './styles';
import { openDrawer } from 'PLActions';
import Followings from './followings';
import Followers from './followers';

class Influences extends Component {
    constructor(props) {
        super(props);
    }

    searchFollowings() {
        Actions.searchFollowing();
    }

    render() {
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container>
                    <Header hasTabs style={styles.header}>
                        <Left>
                            <Button transparent onPress={this.props.openDrawer}>
                                <Icon active name="menu" style={{ color: 'white' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title>My Influences</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.searchFollowings}>
                                <Icon active name="add-circle" style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                    <Tabs initialPage={0} locked={true}>
                        <Tab heading="Followers" tabStyle={styles.tabsStyle} activeTabStyle={styles.tabsStyle}>
                            <Followers />
                        </Tab>
                        <Tab heading="Following" tabStyle={styles.tabsStyle} activeTabStyle={styles.tabsStyle}>
                            <Followings />
                        </Tab>
                    </Tabs>
                </Container>
            </MenuContext>
        )
    }
}

const menuContextStyles = {
    menuContextWrapper: styles.container,
    backdrop: styles.backdrop,
};

const mapStateToProps = state => ({
    token: state.user.token,
    page: state.activities.page,
    totalItems: state.activities.totalItems,
    payload: state.activities.payload,
    count: state.activities.count,
});

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(openDrawer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Influences);