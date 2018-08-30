import { Component } from "can";
import CodeMirror from "codemirror";
import recast from "recast";
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

			const editor = CodeMirror.fromTextArea(
				textarea,	
				{
					lineNumbers: true,
					mode: { name: "javascript" }
				}
			);

			const changeHandler = () => {
				const val = editor.getValue();
				this.source = val;
			};

			editor.on("change", changeHandler);

			return () => {
				editor.off("change", changeHandler);
			};
		},

		source: {
			type: "string",
			value({ resolve, listenTo, lastSet }) {
				let timeoutId = null;

				let latest = [
					"import { DefineMap } from \"can\";",
					"",
					"const ViewModel = DefineMap.extend({",
					"  foo: \"string\"",
					"});"
				].join("\n");

				const update = () => {
					resolve(latest);
				};

				listenTo(lastSet, (val) => {
					clearTimeout(timeoutId);
					latest = val;
					timeoutId = setTimeout(update, 1000);
				});

				resolve(latest);
			}
		},
		
		get ast() {
			return recast.parse(this.source);
		}
	}
});
