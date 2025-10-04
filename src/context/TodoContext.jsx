import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../database/superbaseClient";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 🔹 Fetch todos
  async function fetchTodos() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .select("id, title, description, user_id, is_complete, due_date, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error) setTodos(data);
    setLoading(false);
  }

  // 🔹 Auth state listener
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Fetch todos when user changes
  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setTodos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 🔹 Add todo
  async function addTodo(newTodo) {
    if (!user) return;
    const { error } = await supabase.from("todos").insert([
      {
        title: newTodo.title,
        description: newTodo.description,
        user_id: user.id,
        is_complete: false,
        due_date: newTodo.due_date,
        status: newTodo.status || 'not_started'
      },
    ]);
    if (!error) fetchTodos();
  }

  // 🔹 Update todo
  async function updateTodo(id, updates) {
    const { error } = await supabase
      .from("todos")
      .update(updates)
      .eq("id", id);
    if (!error) fetchTodos();
  }

  // 🔹 Delete todo
  async function deleteTodo(id) {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) fetchTodos();
  }

  // 🔹 Auth helpers
  async function signIn(email, password) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    return await supabase.auth.signOut();
  }

  return (
    <TodoContext.Provider
      value={{
        user,
        todos,
        loading,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        signIn,
        signOut,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}