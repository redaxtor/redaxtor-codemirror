import React, {Component} from "react"
import Codemirror from 'react-codemirror'
import {html as html_beautify} from 'js-beautify'
import Modal from 'react-modal'
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

    onClose() {
        this.props.node ? this.setState({sourceEditorActive: false}) : (this.props.onClose && this.props.onClose())
    }

    render() {
        var options = {
            lineNumbers: true,
            mode: 'htmlmixed'
        };
        var codemirror = null;
        if (this.props.hasOwnProperty('edit') && !this.props.edit) {
            codemirror =
                <div
                    dangerouslySetInnerHTML={{__html: (this.props.data&&this.props.data.html)||this.props.html}}></div>
        }
        else if (!this.state.sourceEditorActive && this.props.node) {
            codemirror =
                <this.props.wrapper style={this.props.style} dangerouslySetInnerHTML={{__html: this.props.data.html}}
                                    onClick={e=>{e.preventDefault();this.setState({sourceEditorActive: true})}}/>;
        } else {
            codemirror =
                <div>
                    {this.state.sourceEditorActive && <div dangerouslySetInnerHTML={{__html: (this.props.data&&this.props.data.html)||this.props.html}}></div>}
                    <Modal isOpen={true} overlayClassName="modal-overlay show" className="modal-content"
                           onRequestClose={this.onClose.bind(this)}>
                        <Codemirror
                            value={html_beautify(this.props.node?this.props.data.html:this.props.html,this.beautifyOptions)}
                            onChange={this.updateCode.bind(this)} options={options}/>
                        <div className="actions-bar">
                            <div className="button button-cancel" onClick={this.onClose.bind(this)}>Cancel</div>
                            <div className="button button-save"
                                 onClick={()=>this.props.node?this.onSave():(this.props.onSave && this.props.onSave(this.code))}>
                                Save
                            </div>
                        </div>
                    </Modal>
                </div>


        }

        return (
            <div>
                {codemirror}
            </div>
        )
    }
}


