import Button from '@/component/module/Button.vue';
import Card from '@/component/module/Card.vue';
import Tab from '@/component/module/Tab.vue';
import Form from '@/component/module/Form.vue';
import FormItem from '@/component/module/FormItem.vue';
import Input from '@/component/module/Input.vue';
import RadioGroup from '@/component/module/RadioGroup.vue';
import Dialog from '@/component/module/Dialog.vue';
import { toast, loading } from './feedbackPlugins';

export function initPlugin(app) {
  app.component(Button.name, Button);
  app.component(Card.name, Card);
  app.component(Tab.name, Tab);
  app.component(Form.name, Form);
  app.component(FormItem.name, FormItem);
  app.component(Input.name, Input);
  app.component(RadioGroup.name, RadioGroup);
  app.component(Dialog.name, Dialog);
  app.use(toast);
  app.use(loading);
}
