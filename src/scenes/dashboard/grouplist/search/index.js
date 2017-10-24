import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Content,
    Container,
    Item,
    Input,
    Text,
    Label,
    Header,
    Body,
    Left,
    Right,
    Button,
    Icon,
    Title,
    List,
    ListItem,
    Thumbnail
} from 'native-base';
import {
    View,
    TouchableOpacity
} from 'react-native';
import styles from './styles';
import { getGroupsBySort, searchGroup, joinGroup } from 'PLActions';
const PLColors = require('PLColors');

class GroupSearch extends Component{
    constructor(props){
        super(props);

        this.state = {
            popularGroups: [],
            newGroups: [],
            text: "",
            searchResults: []
        }

        this.join = this.join.bind(this);
    }

    componentWillMount(){
        var { token } = this.props;

        getGroupsBySort(token, 'popular').then(data => {
            this.setState({
                popularGroups: data
            });
        })
        .catch(err => {

        });

        getGroupsBySort(token, 'new').then(data => {
            this.setState({
                newGroups: data
            })
        })
        .catch(err => {

        });
    }

    onChangeText(text){
        this.setState({
            text: text
        });

        if(text != ''){        
            var { token } = this.props;
            searchGroup(token, text).then(data => {
                this.setState({
                    searchResults: data.payload
                });
            })
            .catch(err => {

            });
        }
    }

    onCreate(){
        Actions.createGroup();
    }

    goToProfile(group){
        Actions.groupprofile(group);
    }

    join(id){
        var { token } = this.props;
        joinGroup(token, id).then(data => {
            if(data.join_status == 'active'){
                Actions.myGroups();
            }else{
                Actions.myGroups();
            }
        })
        .catch(err => {

        })
    }

    render(){
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon active name="arrow-back" style={{color: 'white'}}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Group Search</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.onCreate()}>
                            <Label style={{color: 'white'}}>Create</Label>
                        </Button>
                    </Right>
                </Header>
                <Item style={styles.searchBar}>
                    <Input style={styles.searchInput} placeholder="Search for Groups" value={this.state.text} onChangeText={(text) => this.onChangeText(text)}/>
                    <Icon active name="search" style={styles.searchIcon}/>
                </Item>
                <Content padder>
                    <List style={{backgroundColor: 'white'}}>
                        {this.state.popularGroups.length > 0 && this.state.text == ''?
                        <ListItem itemHeader style={styles.itemHeaderStyle}>
                            <Text style={styles.itemHeaderText}>Popular Groups</Text>
                        </ListItem>: null}
                        {this.state.text == ''?
                        <View>
                        {
                            this.state.popularGroups.map((group, index) => {
                                return (
                                    <ListItem style={styles.listItem} key={index} onPress={() => this.goToProfile(group)}>
                                        {
                                            group.avatar_file_path?
                                            <Thumbnail square source={{uri: group.avatar_file_path}}/>:
                                            <View style={{width: 56, height: 56}}/>
                                        }
                                        <Body>
                                            <Text style={styles.text1}>{group.official_name}</Text>
                                        </Body>
                                        {!group.joined?
                                        <Right>
                                            <Icon name="add-circle" style={styles.joinBtn} onPress={() => this.join(group.id)}/>
                                        </Right>:null}
                                    </ListItem>
                                );
                            })
                        }
                        </View>: null}
                        {this.state.newGroups.length > 0 && this.state.text == ''?
                        <ListItem itemHeader style={styles.itemHeaderStyle}>
                            <Text style={styles.itemHeaderText}>New Groups</Text>
                        </ListItem>: null}
                        {this.state.text == ''?
                        <View>
                        {
                            this.state.newGroups.map((group, index) => {
                                return (
                                    <ListItem style={styles.listItem} key={index} onPress={() => this.goToProfile(group)}>
                                        {
                                            group.avatar_file_path?
                                            <Thumbnail square source={{uri: group.avatar_file_path}}/>:
                                            <View style={{width: 56, height: 56}}/>
                                        }
                                        <Body>
                                            <Text style={styles.text1}>{group.official_name}</Text>
                                        </Body>
                                        {!group.joined?
                                        <Right>
                                            <Icon name="add-circle" style={styles.joinBtn} onPress={() => this.join(group.id)}/>
                                        </Right>:null}
                                    </ListItem>
                                );
                            })
                        }
                        </View>: null}
                        {this.state.text != ''?
                        <ListItem itemHeader style={styles.itemHeaderStyle}>
                            <Text style={styles.itemHeaderText}>Results</Text>
                        </ListItem>: null}
                        {
                            this.state.searchResults.length > 0?
                            <View>
                                {
                                    this.state.searchResults.map((group, index) => {
                                        return (
                                            <ListItem style={styles.listItem} key={index} onPress={() => this.goToProfile(group)}>
                                                {
                                                    group.avatar_file_path?
                                                    <Thumbnail square source={{uri: group.avatar_file_path}}/>:
                                                    <View style={{width: 56, height: 56}}/>
                                                }
                                                <Body>
                                                    <Text style={styles.text1}>{group.official_name}</Text>
                                                </Body>
                                                {!group.joined?
                                                <Right>
                                                    <Icon name="add-circle" style={styles.joinBtn} onPress={() => this.join(group.id)}/>
                                                </Right>:null
                                                }
                                            </ListItem>
                                        );
                                    })
                                }
                            </View>: null
                        }
                        {this.state.text != '' && this.state.searchResults.length == 0?
                        <ListItem style={styles.listItem}>
                            <Label style={{color: 'black'}}>No results were found.</Label>
                        </ListItem>: null}                        
                    </List>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(GroupSearch);