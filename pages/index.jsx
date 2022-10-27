import Head from 'next/head';
import supabase from '../utils/supabase';
import { useEffect, useState } from 'react';

export default function IndexPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  // gets all the tasks from db
  const fetchTodos = async () => {
    const { data: task, error } = await supabase.from('todolist').select('*');

    if (error) {
      console.log('error', error);
    } else {
      setTasks(task);
      console.log(task);
    }
  };

  // adds a task
  const addTodo = async (newTask) => {
    let newtask = newTask.trim();
    if (newtask.length) {
      const { data, error } = await supabase
        .from('todolist')
        .insert([{ task: newtask, completed: true }]);

      if (error) {
        console.log('error', error);
      } else {
        setTasks([...tasks, { task: newtask }]);
      }
    }
  };

  // deletes task
  const deleteTodo = async (id) => {
    try {
      console.log(id);
      const { data, error } = await supabase
        .from('todolist')
        .delete()
        .eq('id', id);
      setTasks(tasks.filter((x) => x.id != id));
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <Head>
        <title>To Do List App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex w-full flex-1 flex-col items-center justify-center px-20 text-center'>
        <h1 className='text-6xl font-bold'>To-do List.</h1>

        <div className='flex mt-8'>
          <input
            type='text'
            placeholder='Task name'
            className='input input-bordered w-full max-w-xs'
            value={newTask}
            onChange={(e) => {
              setNewTask(e.target.value);
            }}
          />

          <button className='btn ml-2' onClick={() => addTodo(newTask)}>
            Add Task
          </button>
        </div>

        <p className='mt-3 text-xs'>For example : Code a to-do list app</p>

        <h2 className='text-3xl font-bold mt-10'>Current Tasks</h2>

        {tasks.map((task) => (
          <div className='flex'>
            <div className='card w-96 bg-base-100 shadow-xl mt-2'>
              <div className='card-body'>
                <div className='flex'>
                  <p>{task.task}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteTodo(task.id);
                    }}
                    className='w-6 h-6 ml-2 border-2 hover:border-black rounded'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='gray'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
