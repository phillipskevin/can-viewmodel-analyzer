import { Component } from "can";
import "./app.less";
import "./code-editor/code-editor";
import "./dependency-data/dependency-data";

Component.extend({
  tag: "sand-box",

  view: `
    <div class="grid-container">
      <div class="header">
        <h1 class="center">CanJS ViewModel Sandbox</h1>
      </div>
      <div class="source-panel">
        <code-editor
          propDefinitions:to="scope.vars.props"
        ></code-editor>
      </div>
      <div class="results-panel">
        <dependency-data
          propDefinitions:from="scope.vars.props"
        ></dependency-data>
      </div>
    </div>
  `,

  ViewModel: {
  }
});
