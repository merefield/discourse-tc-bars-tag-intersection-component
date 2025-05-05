import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import DiscourseURL from "discourse/lib/url";
import { i18n } from "discourse-i18n";
import DButton from "discourse/components/d-button";
import TagChooser from "select-kit/components/tag-chooser";

export default class TagIntersectionChooser extends Component {
  @tracked chosen = [];

  get buttonDisabled() { 
    return this.chosen.length < 2;
  }

  @action
  onChangeUpdateTagSet(item, list) {
    let entries = []
    list.map((entry) =>{
      entries.push(entry.name);
    })
    this.chosen = entries;
  }

  @action
  navigate() {
    let tagSetString = this.chosen.join("/");
    DiscourseURL.routeTo(`/tags/intersection/${tagSetString}`);
  }

  <template>
    <div class="tag-intersection-chooser">
      <h3>{{i18n (themePrefix "tag_intersect_component_heading")}}</h3>
      <TagChooser
        @id="list-with-tags"
        @tags={{this.chosen}}
        @onChange={{this.onChangeUpdateTagSet}}
      />
      <DButton
        @disabled={{this.buttonDisabled}}
        @action={{this.navigate}}
        @label={{(themePrefix "tag_intersect_button_label")}}
      />
      <sub>{{i18n (themePrefix "tag_intersect_component_instructions")}}</sub>
    </div>
  </template>
}
