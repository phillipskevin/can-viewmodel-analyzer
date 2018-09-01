import { Component, DefineMap } from "can";
import recast from "recast";
import getDependencies from "./get-dependencies";

Component.extend({
	tag: "dependency-data",

	view: `
		<h2 class="center">Dependencies</h2>

		<div>
			{{# each(vmDependencies, key=key deps=value) }}
				{{ key }}
				<ul>
						{{# each(deps, dep=value) }}
							<li>{{ dep }}</li>
						{{/ each }}
				</ul>
			{{/ each }}
		</div>
	`,

	ViewModel: {
		vmProps: "any",

		VM: {
			value({ listenTo, resolve }) {
				const update = () => {
					try {
						const c = new Function("C", `return C.extend(${this.vmProps});`);
						const C = c(DefineMap);
						resolve (C);
					} catch(e) {
						// if creating constructor throws, fail silently
						// the user probably isn't done typing
						// console.info("Creating VM failed", e);
					}
				};
				listenTo("vmProps", update);
				update();
			}
		},

		get vm() {
			return new this.VM();
		},

		get vmDependencies() {
			return getDependencies(this.vm);
		}
	}
});
