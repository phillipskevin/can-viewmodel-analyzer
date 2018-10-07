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
          ViewModel:to="scope.vars.ViewModel"
        ></code-editor>
      </div>
      <div class="results-panel">
        <dependency-data
          ViewModel:from="scope.vars.ViewModel"
        ></dependency-data>
      </div>
    </div>
  `,

  ViewModel: {
  }
});
