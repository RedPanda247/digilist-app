import React, { useEffect, useState } from 'react';
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, TaskColorKey } from "./colors";
import { Plus } from './Plus';
import styles from './styles';
import { Task } from './task';
import {
  addTask,
  getDefaultTasks,
  loadTasksFromStorage,
  removeTask,
  saveTasksToStorage,
  TaskData,
  toggleTaskCompletion,
  updateTaskColor,
  updateTaskDueDate,
  updateTaskText
} from './taskUtils';

let padding_small = 8;
let padding_medium = 16;
let font_size_title = 32;
let font_size_text = 18;




export default function Index() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Recursively convert TaskData to TaskProps format
  const convertTaskDataToProps = (taskData: TaskData): any => {
    return {
      taskId: taskData.id,
      text: taskData.name,
      completed: taskData.completed,
      color: taskData.color,
      dueDate: taskData.dueDate,
      subTasks: taskData.subTasks?.map(convertTaskDataToProps)
    };
  };

  // Load tasks from storage when app starts
  const loadTasks = async () => {
    try {
      const savedTasks = await loadTasksFromStorage();
      if (savedTasks.length > 0) {
        setTasks(savedTasks);
      } else {
        // If no saved tasks, create default ones
        const defaultTasks = getDefaultTasks();
        setTasks(defaultTasks);
        await saveTasksToStorage(defaultTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update tasks and save to storage
  const updateTasks = async (newTasks: TaskData[]) => {
    setTasks(newTasks);
    await saveTasksToStorage(newTasks);
  };

  // Handle task text updates
  const handleTaskTextUpdate = async (taskId: string, newText: string) => {
    const updatedTasks = await updateTaskText(tasks, taskId, newText);
    setTasks(updatedTasks);
  };

  // Handle adding new subtasks
  const handleAddSubTask = async (parentTaskId: string) => {
    const updatedTasks = await addTask(tasks, 'New subtask', parentTaskId);
    setTasks(updatedTasks);
  };

  // Handle adding new main tasks
  const handleAddMainTask = async () => {
    const updatedTasks = await addTask(tasks, 'New task');
    setTasks(updatedTasks);
  };

  // Handle removing tasks
  const handleRemoveTask = async (taskId: string) => {
    const updatedTasks = await removeTask(tasks, taskId);
    setTasks(updatedTasks);
  };

  // Handle updating task color
  const handleUpdateColor = async (taskId: string, color: TaskColorKey) => {
    const updatedTasks = await updateTaskColor(tasks, taskId, color);
    setTasks(updatedTasks);
  };

  // Handle toggling task completion
  const handleToggleComplete = async (taskId: string) => {
    const updatedTasks = await toggleTaskCompletion(tasks, taskId);
    setTasks(updatedTasks);
  };

  // Handle updating task due date
  const handleUpdateDueDate = async (taskId: string, dueDate: string | undefined) => {
    const updatedTasks = await updateTaskDueDate(tasks, taskId, dueDate);
    setTasks(updatedTasks);
  };

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background1,
      }}>
        <Text style={styles.headerText}>Loading tasks...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.background1,
      }}>
        <Text style={[styles.titleText, { margin: padding_medium * 4 }]}>
          Digilist
        </Text>
        {/* To do list */}
        <View style={{
        borderStyle: "solid",
        borderColor: colors.grey,
        borderWidth: 0.5,
        borderRadius: padding_small,

        justifyContent: "center",
        backgroundColor: colors.background3,
        width: "90%",
        maxWidth: 256 + 128,
        overflow: "hidden",
      }}>
        {/* Top */}
        <View style={{ 
          padding: padding_medium, 
          backgroundColor: colors.background2,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={styles.headerText}>To do list</Text>
          <TouchableOpacity onPress={handleAddMainTask}>
            <Plus size={24} color={colors.text_color1} />
          </TouchableOpacity>
        </View>
        {/* Content */}
        <View style={{ minHeight: 50, padding: padding_small, gap: padding_small,}}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Task 
                key={task.id}
                taskId={task.id}
                text={task.name}
                completed={task.completed}
                color={task.color}
                dueDate={task.dueDate}
                onUpdateText={handleTaskTextUpdate}
                onAddSubTask={handleAddSubTask}
                onRemoveTask={handleRemoveTask}
                onUpdateColor={handleUpdateColor}
                onUpdateDueDate={handleUpdateDueDate}
                onToggleComplete={handleToggleComplete}
                subTasks={task.subTasks?.map(convertTaskDataToProps)}
              />
            ))
          ) : (
            <Text style={styles.task_title}>No tasks yet</Text>
          )}
        </View>
      </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
