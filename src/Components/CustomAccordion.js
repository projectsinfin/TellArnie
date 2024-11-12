import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';

const CustomAccordion = ({title, content}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    // Add a layout animation for smooth transition
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      {/* Title section */}
      <TouchableOpacity onPress={toggleExpand} style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>

      {/* Content section */}
      {expanded && (
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  titleContainer: {
    padding: 10,
    // backgroundColor: '#f1f1f1',
    backgroundColor: '#1F043B',
  },
  title: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  content: {
    fontSize: 14,
  },
});

export default CustomAccordion;
