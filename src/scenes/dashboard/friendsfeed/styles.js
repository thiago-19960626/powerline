var PLColors = require('PLColors');
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
    btn: {
        borderRadius: 0,
        backgroundColor: PLColors.main,
        alignItems: 'center',
        justifyContent: 'center'
    },

    btnText: {
        color: 'white'
    },

    activeBtn: {
        borderBottomWidth: 2,
        borderBottomColor: 'white',
        borderRadius: 0,
        backgroundColor: PLColors.main,
        alignItems: 'center',
        justifyContent: 'center'
    }
}