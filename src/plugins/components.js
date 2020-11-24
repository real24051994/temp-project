import "@/components";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/assets/vendor/socialhead-icons";

// import Antd from 'ant-design-vue/es';
// Vue.use(Antd)
// [Base, Affix, Anchor, AutoComplete, Alert, Avatar, BackTop, Badge, Breadcrumb, Button, Calendar, Card, Collapse, Carousel, Cascader, Checkbox, Col, DatePicker, Divider, Dropdown, Form, Icon, Input, InputNumber, Layout, List, LocaleProvider, Menu, Modal, Pagination, Popconfirm, Popover, Progress, Radio, Rate, Row, Select, Slider, Spin, Statistic, Steps, Switch, Table, Transfer, Tree, TreeSelect, Tabs, Tag, TimePicker, Timeline, Tooltip, Upload, Drawer, Skeleton, Comment, ConfigProvider, Empty];
import {
  Avatar,
  Badge,
  Button,
  Carousel,
  Checkbox,
  DatePicker,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Icon,
  Input,
  InputNumber,
  List,
  Menu,
  Modal,
  Popover,
  Progress,
  Radio,
  Rate,
  Select,
  Skeleton,
  Slider,
  Spin,
  Switch,
  Tag,
  TimePicker,
  Tooltip,
  notification,
} from "ant-design-vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vue from "vue";
import VueMeta from "vue-meta";
import VueModalConfirmDialog from "@/assets/vendor/vue-confirm";
import Vuelidate from "vuelidate";
import lineClamp from "vue-line-clamp";

Vue.use(Vuelidate);

Vue.use(lineClamp, {});

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});
Vue.use(VueModalConfirmDialog);
var AntComponents = [
  Button,
  Tooltip,
  Icon,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
  TimePicker,
  Dropdown,
  List,
  Menu,
  Form,
  Input,
  InputNumber,
  Select,
  Modal,
  Carousel,
  Spin,
  Empty,
  Popover,
  Progress,
  Skeleton,
  Drawer,
  Rate,
  Avatar,
  Badge,
  Slider,
  Tag,
];
AntComponents.forEach((item) => {
  Vue.use(item);
});
Vue.prototype.$notification = notification;

Vue.component("sh-icon", FontAwesomeIcon);

