// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { firestore, auth, storage } from '../../firebase';
// import TaskItem from '../components/TaskItem';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const HomeScreen = ({ user }) => {
//   const [taskText, setTaskText] = useState('');
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const tasksRef = useRef(null);

//   useEffect(() => {
//     const useAuthCollection = !!user;
//     if (useAuthCollection) {
//       tasksRef.current = firestore()
//         .collection('users')
//         .doc(user.uid)
//         .collection('tasks');
//     } else {
//       tasksRef.current = firestore().collection('tasks');
//     }

//     const unsubscribe = tasksRef.current
//       .orderBy('createdAt', 'desc')
//       .onSnapshot(
//         querySnapshot => {
//           const list = [];
//           querySnapshot.forEach(doc => {
//             list.push({ id: doc.id, ...doc.data() });
//           });
//           setTasks(list);
//           setLoading(false);
//         },
//         error => {
//           Alert.alert('Error fetching tasks', error.message);
//           setLoading(false);
//         },
//       );
//     return () => unsubscribe();
//   }, [user]);

//   const addTask = async () => {
//     const title = taskText.trim();
//     if (!title) return;
//     try {
//       await tasksRef.current.add({
//         title,
//         completed: false,
//         createdAt: firestore.FieldValue.serverTimestamp(),
//       });
//       setTaskText('');
//     } catch (e) {
//       Alert.alert('Add task failed', e.message);
//     }
//   };

//   const toggleCompleted = async task => {
//     try {
//       await tasksRef.current
//         .doc(task.id)
//         .update({ completed: !task.completed });
//     } catch (e) {
//       Alert.alert('Update failed', e.message);
//     }
//   };

//   const deleteTask = async taskId => {
//     try {
//       await tasksRef.current.doc(taskId).delete();
//     } catch (e) {
//       Alert.alert('Delete failed', e.message);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await auth().signOut();
//     } catch (e) {
//       Alert.alert('Sign out failed', e.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>My Tasks</Text>
//         <TouchableOpacity onPress={signOut}>
//           <Icon name="logout" size={22} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.inputRow}>
//         <TextInput
//           placeholder="Add a new task..."
//           value={taskText}
//           onChangeText={setTaskText}
//           style={styles.input}
//         />
//         <TouchableOpacity style={styles.addBtn} onPress={addTask}>
//           <Icon name="add" size={28} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={tasks}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <TaskItem
//             task={item}
//             onToggle={() => toggleCompleted(item)}
//             onDelete={() => deleteTask(item.id)}
//           />
//         )}
//         contentContainerStyle={{ padding: 16 }}
//         ListEmptyComponent={
//           <Text style={{ textAlign: 'center', marginTop: 20 }}>
//             No tasks yet
//           </Text>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
//   title: { fontSize: 22, fontWeight: '700' },
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

// export default HomeScreen;

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { firestore, auth } from '../../firebase';
import TaskItem from '../components/TaskItem';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ user }) => {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const tasksRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Always use authenticated user's collection
    tasksRef.current = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('tasks');

    const unsubscribe = tasksRef.current
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const list = [];
          querySnapshot.forEach(doc => {
            const data = doc.data();
            list.push({ 
              id: doc.id, 
              title: data.title || '',
              completed: data.completed || false,
              createdAt: data.createdAt?.toDate() || new Date(),
            });
          });
          setTasks(list);
          setLoading(false);
        },
        error => {
          console.error('Firestore error:', error);
          Alert.alert('Error fetching tasks', error.message);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    const title = taskText.trim();
    if (!title) {
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to add tasks');
      return;
    }

    try {
      await tasksRef.current.add({
        title: title,
        completed: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setTaskText('');
    } catch (e) {
      console.error('Add task error:', e);
      Alert.alert('Add task failed', e.message);
    }
  };

  const toggleCompleted = async (task) => {
    if (!user) return;
    
    try {
      await tasksRef.current
        .doc(task.id)
        .update({ 
          completed: !task.completed,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (e) {
      Alert.alert('Update failed', e.message);
    }
  };

  const deleteTask = async (taskId) => {
    if (!user) return;
    
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await tasksRef.current.doc(taskId).delete();
            } catch (e) {
              Alert.alert('Delete failed', e.message);
            }
          },
        },
      ]
    );
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (e) {
      Alert.alert('Sign out failed', e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
          <Icon name="logout" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add a new task..."
          value={taskText}
          onChangeText={setTaskText}
          style={styles.input}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleCompleted(item)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tasks yet. Add your first task above!
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f8fafc',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1e293b' },
  signOutBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  addBtn: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 8,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#6b7280',
  },
});

export default HomeScreen;
