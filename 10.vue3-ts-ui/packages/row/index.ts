import {App} from 'vue';
import Row from './../col/src/row.ts';
Row.install = (app:App):void => {
    app.component(Row.name,Row);
}

export default Row;