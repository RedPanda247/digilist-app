import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowDown } from './ArrowDown';
import { ArrowUp } from './ArrowUp';
import { Calendar } from './Calendar';
import { ChevronDown } from './ChevronDown';
import colors, { TaskColorKey, taskColors } from './colors';
import { MoreVertical } from './MoreVertical';
import { Palette } from './Palette';
import { Plus } from './Plus';
import styles from './styles';
import { Trash } from './Trash';

let padding_small = 8;
let padding_medium = 16;
let font_size_title = 32;
let font_size_text = 18;

interface TaskProps {
    taskId?: string;
    text?: string;
    completed?: boolean;
    subTasks?: TaskProps[] | null;
    color?: TaskColorKey;
    dueDate?: string;
    onUpdateText?: (taskId: string, newText: string) => void;
    onAddSubTask?: (parentTaskId: string) => void;
    onRemoveTask?: (taskId: string) => void;
    onUpdateColor?: (taskId: string, color: TaskColorKey) => void;
    onUpdateDueDate?: (taskId: string, dueDate: string | undefined) => void;
    onToggleComplete?: (taskId: string) => void;
    onMoveTask?: (taskId: string, direction: 'up' | 'down') => void;
    isFirst?: boolean;
    isLast?: boolean;
}

export function Task({ taskId, text = 'Task', completed = false, subTasks = null, color = 'red', dueDate, onUpdateText, onAddSubTask, onRemoveTask, onUpdateColor, onUpdateDueDate, onToggleComplete, onMoveTask, isFirst, isLast }: TaskProps) {

    const [isTaskExpanded, setIsTaskExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        if (dueDate) {
            const parsed = new Date(dueDate);
            return isNaN(parsed.getTime()) ? new Date() : parsed;
        }
        return new Date();
    });
    const rotationValue = useRef(new Animated.Value(0)).current;

    const taskColorScheme = taskColors[color] || taskColors.red;

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

    // Track whether we want to auto-expand after adding a subtask
    const pendingExpandRef = useRef(false);

    // Auto-expand when subtasks appear after requesting add
    useEffect(() => {
        if (pendingExpandRef.current && subTasks && subTasks.length > 0 && !isTaskExpanded) {
            pendingExpandRef.current = false;
            setIsTaskExpanded(true);
            Animated.timing(rotationValue, {
                toValue: 1,
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
            // Mark that we want to expand once the new subtask arrives
            if (!isTaskExpanded) {
                pendingExpandRef.current = true;
            }
            onAddSubTask(taskId);
        }
    };

    const handleRemoveTask = () => {
        if (taskId && onRemoveTask) {
            if (Platform.OS === 'web') {
                const confirmed = window.confirm('Are you sure you want to delete this task?');
                setIsMenuVisible(false);
                if (confirmed) {
                    onRemoveTask(taskId);
                }
            } else {
                Alert.alert(
                    'Delete Task',
                    'Are you sure you want to delete this task?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => setIsMenuVisible(false)
                        },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => {
                                setIsMenuVisible(false);
                                onRemoveTask(taskId);
                            }
                        }
                    ],
                    { cancelable: true, onDismiss: () => setIsMenuVisible(false) }
                );
            }
        }
    };

    const handleToggleComplete = () => {
        if (taskId && onToggleComplete) {
            onToggleComplete(taskId);
        }
    };

    const handleColorChange = (newColor: TaskColorKey) => {
        if (taskId && onUpdateColor) {
            onUpdateColor(taskId, newColor);
        }
        setIsColorPickerVisible(false);
        setIsMenuVisible(false);
    };

    const handleDueDateChange = () => {
        if (taskId && onUpdateDueDate) {
            const formatted = selectedDate.toISOString().split('T')[0];
            onUpdateDueDate(taskId, formatted);
        }
        setIsDatePickerVisible(false);
        setIsMenuVisible(false);
    };

    const onDateChange = (event: any, date?: Date) => {
        if (Platform.OS === 'android') {
            setIsDatePickerVisible(false);
        }
        if (date) {
            setSelectedDate(date);
            if (Platform.OS === 'android') {
                // Auto-save on Android
                if (taskId && onUpdateDueDate) {
                    const formatted = date.toISOString().split('T')[0];
                    onUpdateDueDate(taskId, formatted);
                }
                setIsMenuVisible(false);
            }
        }
    };

    const handleClearDueDate = () => {
        if (taskId && onUpdateDueDate) {
            onUpdateDueDate(taskId, undefined);
        }
        setSelectedDate(new Date());
        setIsDatePickerVisible(false);
        setIsMenuVisible(false);
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

    const subtaskCount = subTasks?.length || 0;
    const completedSubtasks = subTasks?.filter(st => st.completed).length || 0;

    return (
        <View
            style={[styles.task, { backgroundColor: taskColorScheme.background }]}
            accessible={true}
            accessibilityLabel={`Task: ${text}${completed ? ', completed' : ''}${dueDate ? `, due ${dueDate}` : ''}${subtaskCount > 0 ? `, ${completedSubtasks} of ${subtaskCount} subtasks completed` : ''}`}
            accessibilityRole="button"
        >
            {/* Top */}
            <View style={[styles.task_top, { backgroundColor: taskColorScheme.top }]}>
                {/* Checkmark icon */}
                <TouchableOpacity
                    onPress={handleToggleComplete}
                    accessible={true}
                    accessibilityLabel={completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: completed }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
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
                </TouchableOpacity>

                {isEditing ? (
                    <Pressable style={{ flex: 1, flexShrink: 1 }} onPress={(e) => e.stopPropagation()}>
                        <TextInput
                            style={[styles.task_title, { borderWidth: 1, borderColor: colors.text_color1, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }]}
                            value={editText}
                            onChangeText={setEditText}
                            onBlur={finishEditing}
                            onSubmitEditing={finishEditing}
                            onKeyPress={(e: any) => {
                                if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                                    e.preventDefault();
                                    finishEditing();
                                }
                            }}
                            multiline
                            blurOnSubmit={false}
                            autoFocus
                            selectTextOnFocus
                            accessible={true}
                            accessibilityLabel="Edit task name"
                            accessibilityHint="Type to change the task name"
                        />
                    </Pressable>
                ) : (
                    <View style={{ flex: 1, flexShrink: 1 }}>
                        <TouchableOpacity
                            onPress={startEditing}
                            accessible={true}
                            accessibilityLabel={`Edit task: ${text}`}
                            accessibilityHint="Double tap to edit task name"
                        >
                            <Text style={[
                                styles.task_title,
                                completed && { textDecorationLine: 'line-through', opacity: 0.6 }
                            ]}>{text}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Due date display */}
                {dueDate && (
                    <View
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 4 }}
                        accessible={true}
                        accessibilityLabel={`Due date: ${dueDate}`}
                    >
                        <Text style={{ color: colors.text_color1, fontSize: 12 }}>{dueDate}</Text>
                    </View>
                )}

                {/* Expand arrow - only visible if task has subtasks */}
                {subTasks && subTasks.length > 0 ? (
                    <TouchableOpacity
                        onPress={toggle_content}
                        style={{ marginRight: 4 }}
                        accessible={true}
                        accessibilityLabel={isTaskExpanded ? 'Collapse subtasks' : 'Expand subtasks'}
                        accessibilityHint={`Shows ${subtaskCount} subtask${subtaskCount !== 1 ? 's' : ''}`}
                        accessibilityRole="button"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            <ChevronDown size={24} color={colors.text_color1} />
                        </Animated.View>
                    </TouchableOpacity>
                ) : null}

                {/* 3-dots menu button */}
                <TouchableOpacity
                    onPress={() => setIsMenuVisible(true)}
                    accessible={true}
                    accessibilityLabel="Open task menu"
                    accessibilityHint="Opens menu with options to delete, add subtask, change color, or set due date"
                    accessibilityRole="button"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <MoreVertical size={24} color={colors.text_color1} />
                </TouchableOpacity>
            </View>

            {/* Menu Modal */}
            <Modal
                visible={isMenuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsMenuVisible(false)}
                accessible={true}
                accessibilityViewIsModal={true}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        setIsMenuVisible(false);
                        setIsColorPickerVisible(false);
                        setIsDatePickerVisible(false);
                    }}
                    accessible={true}
                    accessibilityLabel="Close menu"
                    accessibilityRole="button"
                >
                    <Pressable
                        style={{ backgroundColor: colors.background2, borderRadius: 8, minWidth: isDatePickerVisible ? 250 : 180, maxWidth: '90%', overflow: 'hidden' }}
                        onPress={(e) => e.stopPropagation()}
                        accessible={true}
                        accessibilityLabel="Task menu"
                    >
                        {!isColorPickerVisible && !isDatePickerVisible ? (
                            <>
                                {/* Trash option */}
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.grey }}
                                    onPress={handleRemoveTask}
                                    accessible={true}
                                    accessibilityLabel="Delete task"
                                    accessibilityRole="button"
                                >
                                    <Trash size={20} color={colors.text_color1} />
                                    <Text style={{ color: colors.text_color1, fontSize: 16 }}>Trash</Text>
                                </TouchableOpacity>

                                {/* Sub task option */}
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.grey }}
                                    onPress={() => {
                                        handleAddSubTask();
                                        setIsMenuVisible(false);
                                    }}
                                    accessible={true}
                                    accessibilityLabel="Add subtask"
                                    accessibilityRole="button"
                                >
                                    <Plus size={20} color={colors.text_color1} />
                                    <Text style={{ color: colors.text_color1, fontSize: 16 }}>Sub task</Text>
                                </TouchableOpacity>

                                {/* Color option */}
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.grey }}
                                    onPress={() => setIsColorPickerVisible(true)}
                                    accessible={true}
                                    accessibilityLabel={`Change task color. Current color: ${color}`}
                                    accessibilityRole="button"
                                >
                                    <Palette size={20} color={colors.text_color1} />
                                    <Text style={{ color: colors.text_color1, fontSize: 16 }}>Color</Text>
                                </TouchableOpacity>

                                {/* Due date option */}
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.grey }}
                                    onPress={() => setIsDatePickerVisible(true)}
                                    accessible={true}
                                    accessibilityLabel={dueDate ? `Change due date. Current: ${dueDate}` : 'Set due date'}
                                    accessibilityRole="button"
                                >
                                    <Calendar size={20} color={colors.text_color1} />
                                    <Text style={{ color: colors.text_color1, fontSize: 16 }}>Due date</Text>
                                </TouchableOpacity>

                                {/* Move up / Move down options */}
                                {onMoveTask && (
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 8, opacity: isFirst ? 0.35 : 1 }}
                                            onPress={() => { if (!isFirst && taskId) { onMoveTask(taskId, 'up'); setIsMenuVisible(false); } }}
                                            disabled={isFirst}
                                            accessible={true}
                                            accessibilityLabel="Move task up"
                                            accessibilityRole="button"
                                        >
                                            <ArrowUp size={20} color={colors.text_color1} />
                                            <Text style={{ color: colors.text_color1, fontSize: 16 }}>Up</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 8, opacity: isLast ? 0.35 : 1 }}
                                            onPress={() => { if (!isLast && taskId) { onMoveTask(taskId, 'down'); setIsMenuVisible(false); } }}
                                            disabled={isLast}
                                            accessible={true}
                                            accessibilityLabel="Move task down"
                                            accessibilityRole="button"
                                        >
                                            <ArrowDown size={20} color={colors.text_color1} />
                                            <Text style={{ color: colors.text_color1, fontSize: 16 }}>Down</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        ) : isColorPickerVisible ? (
                            <View style={{ padding: 16 }} accessible={true} accessibilityLabel="Color picker">
                                <Text style={{ color: colors.text_color1, fontSize: 16, marginBottom: 12 }}>Choose color</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {(Object.keys(taskColors) as TaskColorKey[]).map((colorKey) => (
                                        <TouchableOpacity
                                            key={colorKey}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                backgroundColor: taskColors[colorKey].background,
                                                borderWidth: color === colorKey ? 3 : 0,
                                                borderColor: colors.text_color1,
                                            }}
                                            onPress={() => handleColorChange(colorKey)}
                                            accessible={true}
                                            accessibilityLabel={`${colorKey} color${color === colorKey ? ', selected' : ''}`}
                                            accessibilityRole="radio"
                                            accessibilityState={{ selected: color === colorKey }}
                                        />
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <View style={{ padding: 16, width: '100%' }} accessible={true} accessibilityLabel="Date picker">
                                <Text style={{ color: colors.text_color1, fontSize: 16, marginBottom: 12 }}>Set due date</Text>
                                {Platform.OS === 'web' ? (
                                    <>
                                        <input
                                            type="date"
                                            value={selectedDate.toISOString().split('T')[0]}
                                            onChange={(e: any) => {
                                                const newDate = new Date(e.target.value);
                                                if (!isNaN(newDate.getTime())) {
                                                    setSelectedDate(newDate);
                                                }
                                            }}
                                            style={{
                                                backgroundColor: colors.background3,
                                                color: colors.text_color1,
                                                padding: 12,
                                                borderRadius: 4,
                                                border: `1px solid ${colors.grey}`,
                                                fontSize: 16,
                                                width: '100%',
                                                boxSizing: 'border-box' as any,
                                                marginBottom: 12,
                                                colorScheme: 'dark'
                                            }}
                                            aria-label="Select due date"
                                        />
                                    </>
                                ) : (
                                    <View style={{ alignItems: 'center', marginBottom: 12 }}>
                                        <DateTimePicker
                                            value={selectedDate}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={onDateChange}
                                            themeVariant="dark"
                                            style={{ width: '100%' }}
                                        />
                                    </View>
                                )}
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            backgroundColor: taskColors.blue.background,
                                            padding: 12,
                                            borderRadius: 4,
                                            alignItems: 'center',
                                        }}
                                        onPress={handleDueDateChange}
                                        accessible={true}
                                        accessibilityLabel="Confirm due date"
                                        accessibilityRole="button"
                                    >
                                        <Text style={{ color: colors.text_color1 }}>Set</Text>
                                    </TouchableOpacity>
                                    {dueDate && (
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                backgroundColor: taskColors.red.background,
                                                padding: 12,
                                                borderRadius: 4,
                                                alignItems: 'center',
                                            }}
                                            onPress={handleClearDueDate}
                                            accessible={true}
                                            accessibilityLabel="Clear due date"
                                            accessibilityRole="button"
                                        >
                                            <Text style={{ color: colors.text_color1 }}>Clear</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>



            {/* content/sub tasks - only render when expanded */}
            {isTaskExpanded && (
                <View
                    style={{ padding: padding_small, gap: padding_small }}
                    accessible={true}
                    accessibilityLabel={`Subtasks for ${text}`}
                >
                    {/* Generate subtasks from array or show default message */}
                    {subTasks && subTasks.length > 0 ? (
                        subTasks.map((subtask, index) => (
                            <Task
                                key={subtask.taskId || index}
                                taskId={subtask.taskId}
                                text={subtask.text}
                                completed={subtask.completed}
                                subTasks={subtask.subTasks}
                                color={subtask.color || color}
                                dueDate={subtask.dueDate}
                                onUpdateText={onUpdateText}
                                onAddSubTask={onAddSubTask}
                                onRemoveTask={onRemoveTask}
                                onUpdateColor={onUpdateColor}
                                onUpdateDueDate={onUpdateDueDate}
                                onToggleComplete={onToggleComplete}
                            />
                        ))
                    ) : null}
                </View>
            )}
        </View>
    );
}
export default Task;