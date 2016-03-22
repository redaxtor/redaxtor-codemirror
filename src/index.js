import React, {Component} from "react"
import Dialog from 'material-ui/src/dialog';
import FlatButton from 'material-ui/src/flat-button';
import RaisedButton from 'material-ui/src/raised-button';
import Codemirror from 'react-codemirror';
require('codemirror/mode/htmlmixed/htmlmixed');
require('style!css!codemirror/lib/codemirror.css');

export default class CodeMirror extends Component {
    updateCode (newCode) {
        this.code = newCode
    }
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onClick={()=>this.props.cb.close && this.props.cb.close()}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onClick={()=>this.props.cb.save && this.props.cb.save(this.code)}
            />
        ];
        const customContentStyle = {
            width: '100%',
            maxWidth: 'none'
        };
        var options = {
            lineNumbers: true,
            mode: 'htmlmixed'
        };
        return (

            <div>
                <Dialog
                    title="Dialog With Actions"
                    actions={actions}
                    modal={true}
                    open={true}
                    contentStyle={customContentStyle}
                >
                    <Codemirror value={this.props.html} onChange={this.updateCode.bind(this)} options={options} />
                </Dialog>
            </div>
        );
    }
}


