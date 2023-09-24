/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

/// <reference path="./interfaces.d.ts"/>

import { Router } from 'director/build/director.js';
import React from 'react';
import { useState, useEffect, useRef } from 'react';

import ReactDOM from 'react-dom/client';
import { TodoFooter } from "./footer";
import { TodoItem } from "./todoItem";
import { usePrivy } from "@privy-io/react-auth";

import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";


export default function TodoApp(props: IAppProps) {

  const [showing, setShowing] = useState(ACTIVE_TODOS);
  const [editing, setEditing] = useState("");
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const newFieldRef = useRef<HTMLInputElement | null>(null);
  const { ready, authenticated, user, login, logout } = usePrivy();






  function handleNewTodoKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = newFieldRef.current.value.trim();
    console.log("ref val :", val);

    if (val) {
      props.model.addTodo(val);
      newFieldRef.current.value = '';
    }
  }

  function toggleAll(event : React.FormEvent) {
    var target : any = event.target;
    var checked = target.checked;
    props.model.toggleAll(checked);
  }

  function toggle(todoToToggle : ITodo) {
    props.model.toggle(todoToToggle);
  }

  function destroy(todo : ITodo) {
    props.model.destroy(todo);
  }

  function edit(todo : ITodo) {
    setEditing(todo.id)
  }

  function save(todoToSave : ITodo, text : String) {
    props.model.save(todoToSave, text);
    setEditing("")
  }

  function cancel() {
    setEditing("")
  }

  function clearCompleted() {
    props.model.clearCompleted();
  }

 

    var footer;
    var main;
    const todos = props.model.todos;
    console.log("todos from props:", todos);
    console.log("state:", showing);


    var shownTodos = todos.filter((todo) => {
      switch (showing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
      }
    });

    var todoItems = shownTodos
      .sort((a: ITodo, b: ITodo) => {
        if (a.id > b.id) {
          return 1
        } else {
          return -1
        }
      })
      .map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggle.bind(this, todo)}
            onDestroy={destroy.bind(this, todo)}
            onEdit={edit.bind(this, todo)}
            editing={editing === todo.id}
            onSave={save.bind(this, todo)}
            onCancel={ e => this.cancel() }
          />
        );
      });

    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={showing}
          onClearCompleted={ e=> this.clearCompleted() }
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={ e => this.toggleAll(e) }
            checked={activeTodoCount === 0}
          />
          <label
            htmlFor="toggle-all"
          >
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }
  

  return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-softWhite selection:bg-berryBlue dark:bg-trueBlack dark:selection:bg-purpleRain">
        {/* If the user is not authenticated, show a login button */}
        {/* If the user is authenticated, show the user object and a logout button */}
        <h1>zkzelle</h1>

        {ready && authenticated ? (
          <>
                        <header className="bg-amber-300">

          <div>
                    <div>
                
                 
                            <input
                            ref={newFieldRef}
                            placeholder="How many USDC do you want to sell?"
                            onKeyDown={handleNewTodoKeyDown}
                            autoFocus={true}
                          />
                      </div>
            </div>
            </header>
        {main}
        <textarea
              readOnly
              value={JSON.stringify(user, null, 2)}
              style={{ width: "600px", height: "250px", borderRadius: "6px" }}
            />
            <br />
            <button             className="btn" >
              text
              </button>
            <button onClick={logout} style={{ marginTop: "20px", padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>
              Log Out
            </button>
        </>
        ) : (
          <button onClick={login} style={{padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>Log In</button>
        )}


      {footer}

      </div>
  )
  
}
