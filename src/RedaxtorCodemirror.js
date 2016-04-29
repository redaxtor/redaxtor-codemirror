import React, {Component} from "react"
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import Codemirror from 'react-codemirror'
import {html as html_beautify} from 'js-beautify'
require('codemirror/mode/htmlmixed/htmlmixed');

export default class CodeMirror extends Component {
    constructor(props) {
        super(props);
        this.beautifyOptions = {
            "wrap_line_length": 140
        };
        if (this.props.node) {
            this.state = {
                sourceEditorActive: false
            };
        } else {
            this.state = {}
        }
    }

    updateCode(newCode) {
        this.code = newCode
    }

    onSave() {
        this.props.updatePiece && this.props.updatePiece(this.props.id, {data: {html: this.code}})
        this.props.savePiece && this.props.savePiece(this.props.id)
        this.setState({sourceEditorActive: false})
    }

    render() {

        const customContentStyle = {
            width: '80%',
            maxWidth: 'none'
        };
        var options = {
            lineNumbers: true,
            mode: 'htmlmixed'
        };
        var codemirror = null;

        if (!this.state.sourceEditorActive && this.props.node) {
            codemirror = <this.props.wrapper style={this.props.style} dangerouslySetInnerHTML={{__html: this.props.data.html}}
                              onClick={e=>{e.preventDefault();this.setState({sourceEditorActive: true})}}/>;
        } else {
            const actions = [
                <FlatButton label="Cancel" secondary={true}
                            onClick={()=>this.props.node?this.setState({sourceEditorActive: false}):(this.props.onClose && this.props.onClose())}
                />,
                <FlatButton label="Save" primary={true} keyboardFocused={true}
                            onClick={()=>this.props.node?this.onSave():(this.props.onSave && this.props.onSave(this.code))}
                />
            ];
            codemirror =
                <div>
                    {this.props.node && <div dangerouslySetInnerHTML={{__html: (this.props.data&&this.props.data.html)||this.props.html}}></div>}
                    <Dialog title="Edit Source code here" actions={actions} modal={true} open={true}
                            contentStyle={customContentStyle}>
                        <Codemirror
                            value={html_beautify(this.props.node?this.props.data.html:this.props.html,this.beautifyOptions)}
                            onChange={this.updateCode.bind(this)} options={options}/>
                    </Dialog>
                </div>


        }
        return (
            <div>
                {codemirror}
            </div>
        )

    }
}


