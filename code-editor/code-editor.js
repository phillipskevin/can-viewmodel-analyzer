import { Component } from "can";
import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "./code-editor.less"

Component.extend({
	tag: "code-editor",

	view: `
		<h2 class="center">Code Editor</h2>
		<textarea value:bind="source"></textarea>
	`,

	ViewModel: {
		connectedCallback(el) {
			const textarea = el.querySelector("textarea");
			const editor = CodeMirror.fromTextArea(textarea, {
				lineNumbers: true,
				mode: { name: "javascript" }
			});
		},

		source: {
			type: "string",
			default() {
				return [
					"import { DefineMap } from \"can\";",
					"",
					"const ViewModel = DefineMap.extend({",
					"});"
				].join("\n");
			}
		},
		ast: "any"
	}
});
