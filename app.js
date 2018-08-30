import { Component } from "can";
import "./app.less";
import "./code-editor/code-editor";
import "./dependency-data/dependency-data";

Component.extend({
	tag: "viewmodel-analyzer",

	view: `
      <div class="grid-container">
        <div class="header">
          <h1 class="center">CanJS ViewModel Analyzer</h1>
        </div>
        <div class="source-panel">
          <code-editor ast:to="scope.vars.ast"></code-editor>
        </div>
        <div class="results-panel">
          <dependency-data ast:from="scope.vars.ast"></dependency-data>
        </div>
      </div>
	`,

	ViewModel: {
	}
});
