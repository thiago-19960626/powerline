import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Content,
    Text,
    Grid,
    Col,
    Label,
    Button,
    View
} from 'native-base';
import styles from './styles';
import FriendActivity from './activities';

class Friendsfeed extends Component{
    static propTypes = {
        token: React.PropTypes.string
    }

    constructor(props){
        super(props);
    }

    onInfluence(){
         Actions['myInfluences']();
    }

    render(){
        return (
            <Container>
                <View style={{height: 45}}>
                <Grid>
                    <Col>
                        <Button block style={styles.activeBtn}>
                            <Label style={styles.btnText}>Posts by Friends</Label>
                        </Button>
                    </Col>
                    <Col>
                        <Button block style={styles.btn} onPress={() => this.onInfluence()}>
                            <Label style={styles.btnText}>Manage Followers</Label>
                        </Button>
                    </Col>
                </Grid>
                </View>
                <FriendActivity/>
            </Container>
        );
    }
}

export default connect()(Friendsfeed);