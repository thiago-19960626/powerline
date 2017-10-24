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
    Right,
    View,
    Item,
    Input,
    Tabs,
    Tab
} from 'native-base';

import {
    MenuContext
} from 'react-native-popup-menu';
import styles from './styles';
import { openDrawer, searchGroup, searchForUsersFollowableByCurrentUser } from 'PLActions';

import SearchGroups from './groups';
import SearchUsers from './users';

class Search extends Component{
    constructor(props){
        super(props);

        this.state = {
            search: props.search?props.search: '',
            groups: [],
            users: []
        }

        this.onQuery(props.search?props.search: '');
        this.onRemoveUser = this.onRemoveUser.bind();
    }

    onChangeText(text){
        
        this.onQuery(text);

        this.setState({
            search: text
        });
    }

    onQuery(text){
        if(text != ''){
            //search query
            this.setState({
                groups: [],
                users: []
            });

            var { token } = this.props;
            searchForUsersFollowableByCurrentUser(token, text, 1, 20)
            .then(data => {
                this.setState({
                    users: data
                });
            })
            .catch(err => {

            });

            searchGroup(token, text)
            .then(data => {
                this.setState({
                    groups: data.payload
                })
            })
            .catch(err => {

            });
        }
    }

    onRemoveUser(index){
        console.log("remove user function is called");
        this.state.users.splice(index, 1);
        this.setState({
            users: this.state.users
        });
    }

    render(){
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container style={styles.container}>
                    <Header searchBar rounded style={styles.header}>
                        <Left style={{flex: 0.1}}>
                            <Button  transparent onPress={this.props.openDrawer}>
                                <Icon active name="menu" style={{color: 'white'}}/>
                            </Button>
                        </Left>
                        <Item style={styles.searchBar}>
                            <Input style={styles.searchInput} placeholder="Search groups, people, topics" value={this.state.search} onChangeText={(text) => this.onChangeText(text)}/>
                            <Icon active name="search"/>
                        </Item>
                    </Header>
                    <Tabs initialPage={0} locked={true}>
                        <Tab heading="Groups" tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle}>
                            <SearchGroups groups={this.state.groups}/>
                        </Tab>
                        <Tab heading="People" tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle}>
                            <SearchUsers users={this.state.users} onRemove={(index) => this.onRemoveUser(index)}/>
                        </Tab>
                        <Tab heading="Hashtags" tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle}>
                            
                        </Tab>
                    </Tabs>
                </Container>
            </MenuContext>
        );
    }
}

const menuContextStyles = {
    menuContextWrapper: styles.container,
    backdrop: styles.backdrop
}

const mapStateToProps = state => ({
    token: state.user.token
});

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(openDrawer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);