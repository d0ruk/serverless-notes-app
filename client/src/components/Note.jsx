/* eslint function-paren-newline: 0 */
import React from "react";
import { Col, Card, Icon, Tooltip, Popconfirm } from "antd";
import { string, func } from "prop-types";

import styles from "./Note.css";

const Note = ({
  noteId, content,
  attachment, color,
  onDelete, onDownload,
  onSelect,
}) => {
  const actions = [
    <Popconfirm
      title="Are you sure?"
      onConfirm={() => onDelete(noteId)}
      okText="Yes"
      cancelText="No"
    >
      <Icon type="delete" />
    </Popconfirm>
  ];

  if (attachment) {
    actions.push(
      <Tooltip title={attachment}>
        <Icon
          type="download"
          data-filename={attachment}
          onClick={onDownload}
        />
      </Tooltip>,
    );
  }

  return (
    <Col
      xs={24}
      md={11}
      xl={5}
      key={noteId}
      className={styles.column}
    >
      <Card
        style={color ? { background: color } : {}}
        hoverable
        data-note-id={noteId}
        actions={actions}
        className={styles.card}
        onClick={onSelect}
      >
        {content}
      </Card>
    </Col>
  );
};

Note.propTypes = {
  noteId: string.isRequired,
  content: string.isRequired,
  attachment: string,
  color: string,
  onDelete: func.isRequired,
  onDownload: func.isRequired,
  onSelect: func.isRequired,
};

export default Note;
