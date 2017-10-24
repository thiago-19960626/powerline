var PLColors = require('PLColors');
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
    container: {
        backgroundColor: '#e2e7ea',
        flex: 1
    },
    
    header: {
        backgroundColor: PLColors.main
    },

    avatar: {
        width: 80,
        height: 80
    },

    followBtn: {
        marginLeft: 12,
        marginTop: 10,
        backgroundColor: PLColors.main
    }
}