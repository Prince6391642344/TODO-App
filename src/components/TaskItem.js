// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { firestore } from '../../firebase';

// const TaskItem = ({ tasksRef }) => {
//   const [taskText, setTaskText] = useState('');

//   const addTask = async () => {
//     const title = taskText.trim();
//     if (!title) return;
//     try {
//       await tasksRef.add({
//         title,
//         completed: false,
//         createdAt: firestore.FieldValue.serverTimestamp(),
//       });
//       setTaskText('');
//     } catch (e) {
//       Alert.alert('Add task failed', e.message);
//     }
//   };

//   return (
//     <View style={styles.inputRow}>
//       <TextInput
//         placeholder="Add a new task..."
//         value={taskText}
//         onChangeText={setTaskText}
//         style={styles.input}
//       />
//       <TouchableOpacity style={styles.addBtn} onPress={addTask}>
//         <Icon name="add" size={28} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   inputRow: { flexDirection: 'row', padding: 16, alignItems: 'center' },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 12,
//     borderRadius: 8,
//   },
//   addBtn: {
//     backgroundColor: '#2563eb',
//     padding: 12,
//     borderRadius: 8,
//     marginLeft: 8,
//   },
// });

// export default TaskItem;


import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={onDelete} activeOpacity={0.6}>
        <Animated.View style={[styles.deleteBox, { transform: [{ scale }] }]}>
          <Icon name="delete" size={24} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={rightSwipe}>
      <View style={[styles.container, task.completed && styles.completed]}>
        <TouchableOpacity 
          style={styles.checkbox} 
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <Icon 
            name={task.completed ? "check-circle" : "radio-button-unchecked"} 
            size={24} 
            color={task.completed ? "#059669" : "#d1d5db"} 
          />
        </TouchableOpacity>
        
        <Text style={[styles.title, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>
        
        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={onDelete}
          activeOpacity={0.6}
        >
          <Icon name="close" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  completed: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  checkbox: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 8,
  },
  deleteBox: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '80%',
    marginVertical: 8,
    marginRight: 8,
    borderRadius: 8,
  },
});

export default TaskItem;