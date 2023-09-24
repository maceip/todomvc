//import "todomvc-app-css/index.css"
//import "todomvc-common/base.css"
import React from 'react';
import ReactDOM from 'react-dom/client';
import  TodoApp from "./app";
import { TodoModel } from "./todoModel";
import * as collab from './collab'
import { PrivyProvider } from '@privy-io/react-auth';
import "./app.scss";

const namespace = 'react-todos';
var model = new TodoModel(namespace);
const root = ReactDOM.createRoot(document.getElementById('root'));
model.subscribe(root.render);
collab.attach(model);
root.render(
  <React.StrictMode>

    <PrivyProvider appId="clmv0gpkb00btkw0ffskuijko"   onSuccess={(user) => console.log(`User ${user.id} logged in!`)}      >

    <TodoApp model={model}/>
    </PrivyProvider>
    </React.StrictMode>,

  );


