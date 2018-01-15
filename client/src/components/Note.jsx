/* eslint function-paren-newline: 0 */
import React from "react";
import { Col, Card, Icon, Tooltip } from "antd";
import { string, func } from "prop-types";

import styles from "./Note.css";

const Note = ({ noteId, content, attachment, onDelete, onDownload }) => {
  const actions = [
    <Icon type="delete" data-id={noteId} onClick={onDelete} />,
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
        hoverable
        actions={actions}
        className={styles.card}
      >
        {content}
      </Card>
    </Col>
  );
};

Note.propTypes = {
  noteId: string.isRequired,
  content: string.isRequired,
  attachment: string.isRequired,
  onDelete: func.isRequired,
  onDownload: func.isRequired,
};

export default Note;
