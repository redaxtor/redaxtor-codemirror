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

        this.handleKeyUpBinded = this.handleKeyUp.bind(this);
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

    componentWillReceiveProps(newProps) {
        if(newProps.manualActivation) {
            this.props.onManualActivation(this.props.id);
            this.activateEditor();
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
                this.props.setPieceMessage && this.props.setPieceMessage(this.props.id, 'Page refresh required', 'warning');
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

    onClose(event) {
        setTimeout( () => {
            this.props.node ? this.setEditorActive(false) : (this.props.onClose && this.props.onClose());
            this.overlay && this.overlay.removeEventListener('keyup', this.handleKeyUpBinded);
        }, 200 );
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
        if(this.props.node) {
            let content = this.props.node.innerHTML;
            let data = this.props.data;
            let needRender = data.updateNode != undefined && data.updateNode != null ? data.updateNode : true;
            if (content != data.html && needRender == true) {
                this.props.node.innerHTML = data.html;
                this.nodeWasUpdated = true;
            }
        }

    }

    handleKeyUp(event){
        switch (event.keyCode) {
            case 27: //is escape
                event.stopPropagation();
                this.onClose();
                break;
        }
    }

    afterShowModal(){
        this.overlay.tabIndex = "0"; //set for activate key events
        this.overlay.addEventListener('keyup', this.handleKeyUpBinded); //for use native pereventdefault and native event system
        this.overlay.focus();
    }

    onClick(e){
        e.preventDefault();
        this.setEditorActive(true);
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
                                 className="r_modal-content"
                                 onAfterOpen={this.afterShowModal.bind(this)} ref={(overlay) => this.overlay = (overlay && overlay.node.children[0])}
                                 onRequestClose={this.onClose.bind(this)}>
                <Codemirror
                    value={html_beautify(html)}
                    onChange={this.updateCode.bind(this)} options={options}/>
                <div className="actions-bar">
                    <div className="button button-cancel" onClick={this.onClose.bind(this)}>Cancel</div>
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
CodeMirror.__name = "Source code";
