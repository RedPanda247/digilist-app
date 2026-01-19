import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TaskData {
  id: string;
  name: string;
  completed?: boolean;
  subTasks?: TaskData[];
}

export const TASKS_STORAGE_KEY = '@digilist_tasks';

// Generate a simple unique ID
export const generateTaskId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Load tasks from AsyncStorage
export const loadTasksFromStorage = async (): Promise<TaskData[]> => {
  try {
    const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

// Save tasks to AsyncStorage
export const saveTasksToStorage = async (tasks: TaskData[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

// Add a new task
export const addTask = async (tasks: TaskData[], taskName: string, parentId?: string): Promise<TaskData[]> => {
  const newTask: TaskData = {
    id: generateTaskId(),
    name: taskName,
    completed: false,
    subTasks: []
  };

  let updatedTasks: TaskData[];
  
  if (parentId) {
    // Add as subtask
    updatedTasks = addSubTask(tasks, parentId, newTask);
  } else {
    // Add as main task
    updatedTasks = [...tasks, newTask];
  }
  
  await saveTasksToStorage(updatedTasks);
  return updatedTasks;
};

// Helper function to add subtask recursively
const addSubTask = (tasks: TaskData[], parentId: string, newTask: TaskData): TaskData[] => {
  return tasks.map(task => {
    if (task.id === parentId) {
      return {
        ...task,
        subTasks: [...(task.subTasks || []), newTask]
      };
    }
    if (task.subTasks && task.subTasks.length > 0) {
      return {
        ...task,
        subTasks: addSubTask(task.subTasks, parentId, newTask)
      };
    }
    return task;
  });
};

// Toggle task completion
export const toggleTaskCompletion = async (tasks: TaskData[], taskId: string): Promise<TaskData[]> => {
  const updatedTasks = toggleTaskRecursive(tasks, taskId);
  await saveTasksToStorage(updatedTasks);
  return updatedTasks;
};

// Update task text
export const updateTaskText = async (tasks: TaskData[], taskId: string, newText: string): Promise<TaskData[]> => {
  const updatedTasks = updateTaskTextRecursive(tasks, taskId, newText);
  await saveTasksToStorage(updatedTasks);
  return updatedTasks;
};

// Helper function to update task text recursively
const updateTaskTextRecursive = (tasks: TaskData[], taskId: string, newText: string): TaskData[] => {
  return tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        name: newText
      };
    }
    if (task.subTasks && task.subTasks.length > 0) {
      return {
        ...task,
        subTasks: updateTaskTextRecursive(task.subTasks, taskId, newText)
      };
    }
    return task;
  });
};

// Helper function to toggle completion recursively
const toggleTaskRecursive = (tasks: TaskData[], taskId: string): TaskData[] => {
  return tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        completed: !task.completed
      };
    }
    if (task.subTasks && task.subTasks.length > 0) {
      return {
        ...task,
        subTasks: toggleTaskRecursive(task.subTasks, taskId)
      };
    }
    return task;
  });
};

// Remove a task
export const removeTask = async (tasks: TaskData[], taskId: string): Promise<TaskData[]> => {
  const updatedTasks = removeTaskRecursive(tasks, taskId);
  await saveTasksToStorage(updatedTasks);
  return updatedTasks;
};

// Helper function to remove task recursively
const removeTaskRecursive = (tasks: TaskData[], taskId: string): TaskData[] => {
  return tasks
    .filter(task => task.id !== taskId)
    .map(task => ({
      ...task,
      subTasks: task.subTasks ? removeTaskRecursive(task.subTasks, taskId) : undefined
    }));
};

// Clear all tasks
export const clearAllTasks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
};

// Get default tasks for first-time users
export const getDefaultTasks = (): TaskData[] => {
  return [
    {
      id: generateTaskId(),
      name: 'Water plants',
      completed: false,
      subTasks: [
        {
          id: generateTaskId(),
          name: 'vacuum upstairs',
          completed: false
        }
      ]
    },
    {
      id: generateTaskId(),
      name: 'Grocery shopping',
      completed: false,
      subTasks: [
        {
          id: generateTaskId(),
          name: 'Buy milk',
          completed: false
        },
        {
          id: generateTaskId(),
          name: 'Buy bread',
          completed: true
        }
      ]
    }
  ];
};