import React from "react";
import { Spin, Button, Tooltip, Row, Col } from "antd";
import { bool, oneOfType, object, func, string } from "prop-types";
import FileReaderInput from "react-file-reader-input";
import { Loader } from "@doruk/components";

import styles from "./FileInput.css";

const spinner = (
  <Loader
    variant="spin1"
    // fill="rgba(255,0,0,.8)"
    size="lg"
  />
);

const FileInput = ({ loading = false, File, clearFile, ...rest }) => (
  <Row className={styles.container}>
    <Col sm={23}>
      <FileReaderInput
        as="binary"
        {...rest}
      >
        <Spin
          spinning={loading}
          indicator={spinner}
        >
          <Button
            type={File && File.name ? "primary" : "secondary"}
            icon="file-add"
            disabled={!File}
          >
            {File ? File.name || File : ""}
          </Button>
        </Spin>
      </FileReaderInput>
    </Col>
    {File && (
      <Col sm={1}>
        <Tooltip placement="bottom" title="Clear attachment">
          <Button
            type="secondary"
            icon="delete"
            onClick={clearFile}
            disabled={!File || loading}
          />
        </Tooltip>
      </Col>
    )}
  </Row>
);

FileInput.propTypes = {
  loading: bool.isRequired,
  className: string,
  File: oneOfType([
    string, // only the filename (when editing)
    object, // instance of File class from Web API
  ]),
  clearFile: func.isRequired,
};

export default FileInput;
