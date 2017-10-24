import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Header,
    Left,
    Body,
    Title,
    Icon,
    Button,
    List,
    ListItem,
    Text,
    Content,
    Thumbnail,
    Right
} from 'native-base'

import {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
import {
    View,
    RefreshControl
} from 'react-native';

const PLColors = require('PLColors');
import styles from './styles';
import { getRepresentatives, openDrawer } from 'PLActions';

class Representatives extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            per_page: 10,
            items: 0,
            groups: [],
            totalItems: 10,
            refreshing: false
        }
    }

    componentWillMount() {
        this._onRefresh();
    }


    loadRepresentatives() {
        var { token } = this.props;
        console.log(token);
        getRepresentatives(token, 1, 20)
            .then(data => {
                this.setState({
                    groups: data,
                    refreshing: false
                });
            })
            .catch(err => {
                this.setState({
                    refreshing: false
                });
            });
    }

    goToProfile(storageId) {
        Actions.representatyprofile({
            storageId: storageId
        });
    }

    _onRefresh() {
        this.setState({
            refreshing: true
        });
        this.loadRepresentatives();
    }

    render() {
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            <Button transparent onPress={this.props.openDrawer}>
                                <Icon active name="menu" style={{ color: 'white' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title>My Representatives</Title>
                        </Body>
                    </Header>
                    <Content
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }>
                        <List style={{ backgroundColor: 'white' }}>
                            {
                                this.state.groups.map((group, index) => {
                                    return (
                                        <View key={index}>
                                            <ListItem itemHeader style={styles.itemHeaderStyle}>
                                                <Text style={styles.itemHeaderText}>{group.title}</Text>
                                            </ListItem>
                                            {
                                                group.representatives.map((user, index1) => {
                                                    return (
                                                        <ListItem onPress={() => this.goToProfile(user.storage_id)} key={index1}>
                                                            <Thumbnail square size={80} source={{ uri: user.avatar_file_path }} />
                                                            <Body>
                                                                <Text style={{ color: PLColors.main }}>{user.first_name} {user.last_name}</Text>
                                                                <Text note style={styles.text1}>{user.official_title}</Text>
                                                            </Body>
                                                            <Right>
                                                                <Icon name="ios-arrow-forward" />
                                                            </Right>
                                                        </ListItem>
                                                    );
                                                })
                                            }
                                        </View>
                                    )
                                })
                            }
                        </List>
                    </Content>
                </Container>
            </MenuContext>
        );
    }
}

const menuContextStyles = {
    menuContextWrapper: styles.container,
    backdrop: styles.backdrop
};

const mapStateToProps = state => ({
    token: state.user.token
});

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(openDrawer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Representatives);