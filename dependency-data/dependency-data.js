import { Component, DefineMap } from "can";
import recast from "recast";

Component.extend({
	tag: "dependency-data",

	view: `
		<h2 class="center">Dependencies</h2>

		<div>
			{{ vmProps }}
		</div>
	`,

	ViewModel: {
		ast: "any",

		get vmProps() {
			return recast.print(
					this.ast.program.body[1].declarations[0].init.arguments[0]
			).code;
		},

		get VM() {
			return DefineMap.extend(this.vmProps);
		},

		get vm() {
			return new this.VM();
		}
	}
});
