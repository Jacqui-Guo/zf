import { App } from 'vue';
import Button from '@z-ui/button';
import Icon from '@z-ui/icon';
import ButtonGroup from '@z-ui/button-group';
import Col from '@z-ui/col';
import Row from '@z-ui/row';

import Checkbox from '@z-ui/checkbox';
import CheckboxGroup from '@z-ui/checkbox-group';


const components = [
    Button,
    Icon,
    ButtonGroup,
    Col,
    Row,
    Checkbox,
    CheckboxGroup
]
const install = (app:App):void =>{
    components.forEach(component=>{
        app.component(component.name,component)
    })
}
// 在使用组件库的时候可以使用 createApp().use(XXX)
export default {
    install
}

// 组件库看效果的网址 -》 文档  =》 md -> webpack