import { Component, DefineMap } from "can";
import recast from "recast";
import vis from "vis";
import getDependencies from "./get-dependencies";
import "./dependency-data.less";

Component.extend({
	tag: "dependency-graph",

	view: `
		<h3>dependencies for "{{key}}":</h3>
		<div class="graph"></div>
	`,

	ViewModel: {
		connectedCallback(el) {
			const key = this.key
			const dependencies = this.dependencyData;

			// console.log("dependencies", dependencies);

			let nodeId = 1;
			const nodeToIdMap = {
				[key]: nodeId
			};

			const nodes = [
			{ id: 1, label: key }
			];
			const edges = [];

			const addNodesAndEdges = (key) => {
				const deps = dependencies[key];

				if (deps) {
					deps.forEach((dep) => {
						// add node for this dependency if it doesn't exist
						if (!nodeToIdMap[dep]) {
							nodeToIdMap[dep] = ++nodeId;
							nodes.push({ id: nodeId, label: dep });
						}

						// add edge for this dependency
						edges.push({
							from: nodeToIdMap[dep],
							to: nodeToIdMap[key],
							arrows: "to"
						});

						// add nodes and edges for dependencies of this dependency
						addNodesAndEdges(dep);
					});
				}
			};

			addNodesAndEdges(key);

			const options = {
				layout: {
					hierarchical: {
						direction: "RL"
					}
				}
			};

			new vis.Network(el.querySelector(".graph"), {
				nodes: new vis.DataSet(nodes),
				edges: new vis.DataSet(edges)
			}, options);

		},
		key: "string",
		dependencyData: "any"
	}
});

Component.extend({
	tag: "dependency-data",

	view: `
		<h2 class="center">Dependencies</h2>

		<div>
			{{# each(dependencies, key=key }}
				<dependency-graph key:from="key" dependencyData:from="scope.vm.dependencies"></dependency-graph>
			{{/ each }}
		</div>
	`,

	ViewModel: {
		propDefinitions: "any",

		VM: {
			value({ listenTo, resolve }) {
				const update = () => {
					try {
						const c = new Function("C", `return C.extend(${this.propDefinitions});`);
						const C = c(DefineMap);
						resolve(C);
					} catch(e) {
						// if creating constructor throws, fail silently
						// the user probably isn't done typing
						// ie user is in the middle of typing a property name
						// `fo`
						// console.info("Creating VM failed", e);
					}
				};
				listenTo("propDefinitions", update);
				update();
			}
		},

		get vm() {
			return new this.VM();
		},

		dependencies: {
			value({ listenTo, resolve }) {
				const update = (vm) => {
					try {
						const deps = getDependencies(this.vm);
						resolve(deps);
					} catch(e) {
						// if getting dependencies throws, fail silently
						// the user probably isn't done typing
						// ie user is in the middle of typing a getter
						// `get foo() { ret }`
						// console.info("getting dependencies failed", e);
					}
				};

				listenTo("vm", update);
				update(this.vm);
			}
		}
	}
});
