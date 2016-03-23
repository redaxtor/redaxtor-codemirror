import React, {Component} from "react"
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Codemirror from 'react-codemirror';
require('codemirror/mode/htmlmixed/htmlmixed');
require('style!css!codemirror/lib/codemirror.css');

export default class CodeMirror extends Component {
    constructor(props) {
        super(props);
        if (this.props.node){
            this.state = {
                sourceEditorActive: false
            };
        } else {
            this.state = {}
        }
    }
    updateCode (newCode) {
        this.code = newCode
    }
    onSave(){
        this.props.updatePiece && this.props.updatePiece(this.props.id, {data: {html: this.code}})
        this.props.savePiece && this.props.savePiece(this.props.id)
        this.setState({sourceEditorActive: false})
    }
    makeReadable(readableHTML){
        var lb = '\r\n',i;
        var htags = ["<html","</html>","</head>","<title","</title>","<meta","<link","<style","</style>","</body>"];
        for (i=0; i<htags.length; ++i) {
            var hhh = htags[i];
            readableHTML = readableHTML.replace(new RegExp(hhh,'gi'),lb+hhh);
        }
        var btags = ["</div>","</span>","</form>","</fieldset>","<br>","<br />","<hr","<pre","</pre>","<blockquote",
            "</blockquote>","<ul","</ul>","<ol","</ol>","<li","<dl","</dl>","<dt","</dt>","<dd","</dd>",
            "<\!--","<table","</table>","<caption","</caption>","<th","</th>","<tr","</tr>","<td","</td>","<script",
            "</script>","<noscript","</noscript>","<a", "</a>", "<img"];
        for (i=0; i<btags.length; ++i) {
            var bbb = btags[i];
            readableHTML = readableHTML.replace(new RegExp(bbb,'gi'),lb+bbb);
        }
        var ftags = ["<label","</label>","<legend","</legend>","<object","</object>","<embed","</embed>","<select","</select>","<option","<option","<input","<textarea","</textarea>"];
        for (i=0; i<ftags.length; ++i) {
            var fff = ftags[i];
            readableHTML = readableHTML.replace(new RegExp(fff,'gi'),lb+fff);
        }
        var xtags = ["<body","<head","<div","<span","<p","<form","<fieldset"];
        for (i=0; i<xtags.length; ++i) {
            var xxx = xtags[i];
            readableHTML = readableHTML.replace(new RegExp(xxx,'gi'),lb+lb+xxx);
        }
        return readableHTML;
    }
    render() {

        const customContentStyle = {
            width: '60%',
            maxWidth: 'none'
        };
        var options = {
            lineNumbers: true,
            mode: 'htmlmixed'
        };
        var codemirror = null;
        debugger
        if (!this.state.sourceEditorActive&&this.props.node) {
            codemirror = <div dangerouslySetInnerHTML={{__html: this.props.data.html}} onClick={e=>{e.preventDefault();this.setState({sourceEditorActive: true})}}></div>;
        } else {
            const actions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onClick={()=>this.props.node?this.setState({sourceEditorActive: false}):(this.props.onClose && this.props.onClose())}
                />,
                <FlatButton
                    label="Save"
                    primary={true}
                    keyboardFocused={true}
                    onClick={()=>this.props.node?this.onSave():(this.props.onSave && this.props.onSave(this.code))}
                />
            ];
            codemirror = <Dialog
                title="Dialog With Actions"
                actions={actions}
                modal={true}
                open={true}
                contentStyle={customContentStyle}
            >
                <Codemirror value={this.makeReadable(this.props.node?this.props.data.html:this.props.html)} onChange={this.updateCode.bind(this)} options={options} />
            </Dialog>
        }
        return(
            <div>
            {codemirror}
                </div>
        )

    }
}


