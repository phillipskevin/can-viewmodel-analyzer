import { Component } from "can";
import "./app.less";
import "./code-editor/code-editor";

Component.extend({
	tag: "dependency-data",

	view: `
		<h2 class="center">Dependencies</h2>
	`,

	ViewModel: {
	}
});

Component.extend({
	tag: "viewmodel-analyzer",

	view: `
      <div class="grid-container">
        <div class="header">
          <h1 class="center">CanJS ViewModel Test Generator</h1>
        </div>
        <div class="source-panel">
          <code-editor></code-editor>
        </div>
        <div class="results-panel">
          <dependency-data></dependency-data>
        </div>
      </div>
	`,

	ViewModel: {
	}
});
