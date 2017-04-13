import React, {Component} from "react"
import Codemirror from 'react-codemirror'
import {html as html_beautify} from 'js-beautify'
import Modal from 'react-modal'
require('codemirror/mode/htmlmixed/htmlmixed');

export default class CodeMirror extends Component {
    constructor(props) {
        super(props);

        this.onClickBound = this.onClick.bind(this);

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
        this.code = this.props.data && this.props.data.html || this.props.html;

        if(this.props.data) {
            this.initDataKeys = Object.keys(this.props.data);
        }
    }

    setEditorActive(active) {
        if(active != this.state.sourceEditorActive) {
            this.setState({sourceEditorActive: active});
            this.props.onEditorActive && this.props.onEditorActive(this.props.id, active);
        }
    }

    /**
     * That is a common public method that should activate component editor if it presents
     */
    activateEditor() {
        if(this.props.editorActive && !this.state.sourceEditorActive) {
            this.setEditorActive(true);
        }
    }

    deactivateEditor() {
        if(this.props.editorActive && this.state.sourceEditorActive) {
            this.setEditorActive(false);
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.manualActivation) {
            this.props.onManualActivation(this.props.id);
            this.activateEditor();
        }
        if(newProps.manualDeactivation) {
            this.props.onManualDeactivation(this.props.id);
            this.deactivateEditor();
        }
    }

    componentWillUnmount(){
        console.log(`Code mirror ${this.props.id} unmounted`);
    }

    updateCode(newCode) {
        this.code = newCode
    }

    shouldComponentUpdate(nextProps, nextState){
        let data = this.props.data;
        if (data) {
            let needRender = data.updateNode != undefined && data.updateNode != null ? data.updateNode : true;
            if (!needRender && nextProps.data != this.props.data) {
                let isChanged = false;
                this.initDataKeys.forEach(key => isChanged = isChanged && (nextProps.data[key] != this.props.data[key]));
                this.props.setPieceMessage && this.props.setPieceMessage(this.props.id, 'Page refresh is required', 'warning');
            }
        }
        return true;
    }

    componentDidUpdate() {
        this.nodeWasUpdated && this.props.onNodeResized && this.props.onNodeResized(this.props.id);
    }

    onSave() {
        this.props.updatePiece && this.props.updatePiece(this.props.id, {data: {html: this.code, updateNode: this.props.data.updateNode}});
        this.props.savePiece && this.props.savePiece(this.props.id);
        this.setEditorActive(false);
    }

    onClose() {
        this.props.node ? this.setEditorActive(false) : (this.props.onClose && this.props.onClose())
    }

    createEditor(){
        // this.props.node
        if(this.props.node) {
            this.props.node.addEventListener('click', this.onClickBound);
        }
    }

    destroyEditor(){
        if(this.props.node) {
            this.props.node.removeEventListener('click', this.onClickBound);
        }
    }

    renderNonReactAttributes(){
        if (this.props.editorActive && !this.state.sourceEditorActive) {
            this.createEditor();
            if(this.props.node) {
                this.props.node.classList.add(...this.props.className.split(' '));
            }
        }
        else {
            this.destroyEditor();
            if(this.props.node) {
                this.props.node.classList.remove(...this.props.className.split(' '));
            }
        }

        this.nodeWasUpdated = false;

        //render new data
        this.nodeWasUpdated = CodeMirror.applyEditor(this.props.node, this.props.data);
    }

    onClick(e){
        e.preventDefault();
        e.stopPropagation();
        this.setEditorActive(true);
    }

    handleCloseModal(event){
        if(event.type == 'keydown' && event.keyCode === 27) {
            this.modalNode.parentNode.dispatchEvent(new KeyboardEvent('keyDown', {key: 'Escape'}));
        }
    }


    render() {
        let codemirror = null;

        if(this.state.sourceEditorActive || !this.props.node){
            //if there is no this.props.node, it means this component is invoked manually with custom html directly in props and should be just rendered
            //if this.state.sourceEditorActive and this.props.node presents, it means that is a regular piece with control over node and sourceEditorActive means modal is open
            let options = {
                lineNumbers: true,
                mode: 'htmlmixed'
            };
            const html = this.props.node ? this.props.data.html : this.props.html;
            codemirror =  <Modal contentLabel="Edit source" isOpen={true} overlayClassName="r_modal-overlay r_visible"
                                 className="r_modal-content" ref={(modal) => this.modalNode = (modal && modal.node)}
                                 onRequestClose={this.handleCloseModal.bind(this)}>
                <div className="r_modal-title">
                    <div className="r_modal-close" onClick={this.onClose.bind(this)}>
                        <i className="rx_icon rx_icon-close">&nbsp;</i>
                    </div>
                    <span>Edit Source Code</span>
                </div>
                <Codemirror
                    value={html_beautify(html)}
                    onChange={this.updateCode.bind(this)} options={options}/>
                <div className="r_modal-actions-bar">
                    <div className="button button-save"
                         onClick={()=>this.props.node ? this.onSave() : (this.props.onSave && this.props.onSave(this.code))}>
                        Save
                    </div>
                </div>
            </Modal>;
        } else {
            codemirror = React.createElement(this.props.wrapper, {});
        }

        this.renderNonReactAttributes();
        return codemirror;
    }
}


/**
 * Specify component should be rendered inside target node and capture all inside html
 * @type {string}
 */
CodeMirror.__renderType = "BEFORE";
CodeMirror.__editLabel = "Edit Source Code";
CodeMirror.__name = "Source code";
CodeMirror.applyEditor = function(node, data){
    if(node) {
        let content = node.innerHTML;
        let needRender = data.updateNode !== undefined && data.updateNode !== null ? data.updateNode : true;
        if (content !== data.html && needRender === true) {
            node.innerHTML = data.html;
            return true;
        }
    }
    return false;
};