import { createWidget } from 'discourse/widgets/widget';
import { hbs } from "ember-cli-htmlbars";
import RenderGlimmer from "discourse/widgets/render-glimmer";
import DiscourseURL from "discourse/lib/url";

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
      button_disabled: true,
    };
  },

  html(attrs, state) {
    const contents = [];

    contents.push(
      new RenderGlimmer(
        this,
        "div.tag-chooser-component",
        hbs`<h3>{{@data.componentHeading}}</h3><TagChooser @id="list-with-tags"  @tags={{@data.chosen}} @onChange={{action @data.onChangeUpdateTagSet}}/>
        <DButton @disabled={{@data.buttonDisabled}} @action={{@data.actionForClick}} @translatedLabel={{@data.buttonLabel}}/><sub>{{@data.componentInstructions}}</sub>`,
        {
          ...attrs,
          chosen: state.chosen,
          onChangeUpdateTagSet: this.onChangeUpdateTagSet.bind(this),
          actionForClick: this.actionForClick.bind(this),
          buttonLabel: I18n.t(themePrefix("tag_intersect_button_label")),
          componentHeading: I18n.t(themePrefix("tag_intersect_component_heading")),
          componentInstructions: I18n.t(themePrefix("tag_intersect_component_instructions")),
          buttonDisabled: state.button_disabled,
        }
      ),
    );
    return contents;
  },

  onChangeUpdateTagSet(item, list) {
    let entries = []
    list.map((entry) =>{
      entries.push(entry.name);
    })
    this.state.chosen = entries;
    this.state.button_disabled = entries.length < 2 ? true : false;
    this.scheduleRerender();
  },

  actionForClick () {
    console.log(this.state.chosen);
    let tagSetString = this.state.chosen.join("/");
    DiscourseURL.routeTo(`/tags/intersection/${tagSetString}`);
  },
});
