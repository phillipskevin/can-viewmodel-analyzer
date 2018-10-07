import { Component, key } from "can";
import CodeMirror from "codemirror";
import recast from "recast";
import "codemirror/mode/javascript/javascript";
import "./code-editor.less"

Component.extend({
  tag: "code-editor",

  view: `
    <h2 class="center">ViewModel</h2>
    <textarea value:bind="source"></textarea>
  `,

  ViewModel: {
    connectedCallback(el) {
      const textarea = el.querySelector("textarea");

      const editor = CodeMirror.fromTextArea(
        textarea,
        {
          lineNumbers: true,
          // make textarea grow infinitely
          viewportMargin: Infinity,
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
          "  first: { default: \"Kevin\" },",
          "  last: { default: \"McCallister\" },",
          "  get name() { return `${this.first} ${this.last}`; }",
          "});"
        ].join("\n");

        const update = () => {
          resolve(latest);
        };

        listenTo(lastSet, (val) => {
          clearTimeout(timeoutId);
          latest = val;
          // only update source if it hasn't been set for... some time
          timeoutId = setTimeout(update, 500);
        });

        // set the default source
        resolve(latest);
      }
    },

    ast: {
      value({ listenTo, resolve }) {
        const update = () => {
          try {
            const ast = recast.parse(this.source);
            resolve(ast);
          } catch(e) {
            // if parsing throws, fail silently
            // the user probably isn't done typing
            // console.info("parsing AST failed", e);
          }
        };
        listenTo("source", update);
        update();
      }
    },

    get propDefinitions() {
      const props = key.get(this.ast, "program.body[1].declarations[0].init.arguments[0]");
      return recast.print(props).code;
    }
  }
});
