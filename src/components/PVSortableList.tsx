import React from 'react'
import { StyleSheet } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'

type Props = {
  data: any[]
  isEditing?: boolean
  onDragEnd: any
  renderItem: any
}

export class PVSortableList extends React.Component<Props> {
  render() {
    const { data, isEditing, onDragEnd, renderItem } = this.props

    return (
      <DraggableFlatList
        data={data}
        keyExtractor={
          (item) => {
            const id = item.clipId || item.episodeId || item.id
            return `draggable-item-${id}-${isEditing ? 'isEditing' : 'isNotEditing'}`}
          }
        onDragEnd={onDragEnd}
        renderItem={renderItem}
        style={styles.list}
      />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
})
