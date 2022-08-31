import { createWidget } from 'discourse/widgets/widget';
import { hbs } from "ember-cli-htmlbars";
import RenderGlimmer from "discourse/widgets/render-glimmer";
import { bind } from "discourse-common/utils/decorators";
import { computed, setProperties } from "@ember/object";

let layouts;

// Import layouts plugin with safegaurd for when widget exists without plugin:
try {
  layouts = requirejs(
    'discourse/plugins/discourse-layouts/discourse/lib/layouts'
  );
} catch (error) {
  layouts = { createLayoutsWidget: createWidget };
  console.warn(error);
}

export default layouts.createLayoutsWidget('tag-combo', {
  tagname: "div.tag-combo-control",
  buildKey: () => `tag-intersection-widget`,

  defaultState() {
    return {
      chosen: [],
    };
  },

  html(attrs, state) {
    const contents = [];

    contents.push(
      new RenderGlimmer(
        this,
        "div.tag-chooser-component",
        hbs`<TagChooser @id="list-with-tags"  @tags={{@data.chosen}} @onChange={{action @data.onChangeUpdateTagSet}}/>
        <button onClick={{@data.actionForClick}} label="blah"/>`,
        {
          ...attrs,
          chosen: state.chosen,
          onChangeUpdateTagSet: this.onChangeUpdateTagSet,
          actionForClick: this.actionForClick,
        }
      ),
    );
    return contents;
  },

  @bind
  onChangeUpdateTagSet(item, list) {
    let entries = []
    list.map((entry) =>{
      entries.push(entry.name);
    })
    this.state.chosen = entries;
    this.scheduleRerender();
  },

  @bind
  actionForClick () {
    console.log(this.state.chosen)
  }
});
