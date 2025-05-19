import React, { useState } from 'react';
import { Input, Button, List, Modal, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const VideoNotes = ({ currentTime, duration }) => {
  const [notes, setNotes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (!noteText.trim()) {
      message.warning('Vui lòng nhập nội dung ghi chú');
      return;
    }

    const newNote = {
      id: Date.now(),
      time: currentTime,
      text: noteText,
    };

    setNotes([...notes, newNote].sort((a, b) => a.time - b.time));
    setNoteText('');
    setIsModalVisible(false);
    message.success('Đã thêm ghi chú');
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteText(note.text);
    setIsModalVisible(true);
  };

  const handleUpdateNote = () => {
    if (!noteText.trim()) {
      message.warning('Vui lòng nhập nội dung ghi chú');
      return;
    }

    setNotes(notes.map(note => 
      note.id === editingNote.id 
        ? { ...note, text: noteText }
        : note
    ));
    setNoteText('');
    setEditingNote(null);
    setIsModalVisible(false);
    message.success('Đã cập nhật ghi chú');
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
    message.success('Đã xóa ghi chú');
  };

  const handleTimeClick = (time) => {
    // Emit event to parent component to seek to this time
    window.dispatchEvent(new CustomEvent('seekTo', { detail: { time } }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Ghi chú video</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingNote(null);
            setNoteText('');
            setIsModalVisible(true);
          }}
        >
          Thêm ghi chú
        </Button>
      </div>

      <List
        dataSource={notes}
        renderItem={note => (
          <List.Item
            actions={[
              <Button
                key="edit"
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditNote(note)}
              />,
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteNote(note.id)}
              />
            ]}
          >
            <List.Item.Meta
              title={
                <Button
                  type="link"
                  onClick={() => handleTimeClick(note.time)}
                  className="p-0"
                >
                  {formatTime(note.time)}
                </Button>
              }
              description={note.text}
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingNote ? "Chỉnh sửa ghi chú" : "Thêm ghi chú mới"}
        open={isModalVisible}
        onOk={editingNote ? handleUpdateNote : handleAddNote}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingNote(null);
          setNoteText('');
        }}
      >
        <Input.TextArea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Nhập nội dung ghi chú..."
          rows={4}
        />
        <div className="mt-2 text-gray-500">
          Thời gian hiện tại: {formatTime(currentTime)}
        </div>
      </Modal>
    </div>
  );
};

export default VideoNotes; 