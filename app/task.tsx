import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronDown } from './ChevronDown';
import { Plus } from './Plus';
import { Trash } from './Trash';
import colors from './colors';
import styles from './styles';

let padding_small = 8;
let padding_medium = 16;
let font_size_title = 32;
let font_size_text = 18;

interface TaskProps {
    taskId?: string;
    text?: string;
    completed?: boolean;
    subTasks?: TaskProps[] | null;
    onUpdateText?: (taskId: string, newText: string) => void;
    onAddSubTask?: (parentTaskId: string) => void;
    onRemoveTask?: (taskId: string) => void;
}

export function Task({ taskId, text = 'Task', completed = false, subTasks = null, onUpdateText, onAddSubTask, onRemoveTask }: TaskProps) {

    const [isTaskExpanded, setIsTaskExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);
    const rotationValue = useRef(new Animated.Value(0)).current;

    // Auto-collapse task when no subtasks remain
    useEffect(() => {
        if (isTaskExpanded && (!subTasks || subTasks.length === 0)) {
            setIsTaskExpanded(false);
            // Reset rotation animation
            Animated.timing(rotationValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [subTasks, isTaskExpanded, rotationValue]);

    const toggle_content = () => {
        // Just toggle the state and rotate the chevron
        const toValue = isTaskExpanded ? 0 : 1;

        Animated.timing(rotationValue, {
            toValue,
            duration: 200,
            useNativeDriver: true,
        }).start();

        setIsTaskExpanded(!isTaskExpanded);
    };

    const handleAddSubTask = () => {
        if (taskId && onAddSubTask) {
            onAddSubTask(taskId);
            // Expand the task to show the new subtask
            if (!isTaskExpanded) {
                toggle_content();
            }
        }
    };

    const handleRemoveTask = () => {
        if (taskId && onRemoveTask) {
            onRemoveTask(taskId);
        }
    };

    const startEditing = () => {
        setIsEditing(true);
        setEditText(text);
    };

    const finishEditing = () => {
        if (taskId && onUpdateText && editText.trim()) {
            onUpdateText(taskId, editText.trim());
        }
        setIsEditing(false);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditText(text);
    };

    // interpolate the 0 1 value to deg
    const rotation = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.task}>
            {/* Top */}
            <View style={styles.task_top}>
                <View style={{
                    borderStyle: "solid",
                    borderColor: "#ffffff",
                    borderWidth: 2,
                    borderRadius: 99999,
                    height: font_size_text,
                    width: font_size_text,
                    backgroundColor: completed ? colors.text_color1 : 'transparent',
                }}>
                </View>
                {isEditing ? (
                    <TextInput
                        style={[styles.task_title, { borderWidth: 1, borderColor: colors.text_color1, padding: 4, borderRadius: 4, flex: 1 }]}
                        value={editText}
                        onChangeText={setEditText}
                        onBlur={finishEditing}
                        onSubmitEditing={finishEditing}
                        autoFocus
                        selectTextOnFocus
                    />
                ) : (
                    <TouchableOpacity onPress={startEditing} style={{ flex: 1 }}>
                        <Text style={styles.task_title}>{text}</Text>
                    </TouchableOpacity>
                )}

                {/* Plus button for adding subtasks - always visible */}
                <TouchableOpacity onPress={handleAddSubTask} style={{ marginRight: 8 }}>
                    <Plus size={20} color={colors.text_color1} />
                </TouchableOpacity>

                {/* Trash button for removing task - always visible */}
                <TouchableOpacity onPress={handleRemoveTask} style={{ marginRight: 8 }}>
                    <Trash size={18} color={colors.text_color1} />
                </TouchableOpacity>

                {subTasks && subTasks.length > 0 ? (
                    <TouchableOpacity onPress={toggle_content}>
                        {/* Chevron down */}
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            <ChevronDown size={24} color={colors.text_color1} />
                        </Animated.View>
                    </TouchableOpacity>
                ) : null}

            </View>



            {/* content/sub tasks - only render when expanded */}
            {isTaskExpanded && (
                <View style={{ padding: padding_small, gap: padding_small, }}>
                    {/* Generate subtasks from array or show default message */}
                    {subTasks && subTasks.length > 0 ? (
                        subTasks.map((subtask, index) => (
                            <Task
                                key={subtask.taskId || index}
                                taskId={subtask.taskId}
                                text={subtask.text}
                                completed={subtask.completed}
                                subTasks={subtask.subTasks}
                                onUpdateText={onUpdateText}
                                onAddSubTask={onAddSubTask}
                                onRemoveTask={onRemoveTask}
                            />
                        ))
                    ) : null}
                </View>
            )}
        </View>
    );
}
export default Task;