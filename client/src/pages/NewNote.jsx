import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { func, string, shape, number } from "prop-types";
import { Row, Col, Input, Button, Tooltip, Spin, notification } from "antd";
import { history as historyProps } from "react-router-prop-types";
import debounce from "lodash/debounce";
import FileReaderInput from "react-file-reader-input";
import debug from "debug";

import styles from "./NewNote.css";
import { setContent, putFile, createNote } from "../state/actions/notes-actions";

const MAX_ATTACHMENT_SIZE = 5000000;
const isProd = process.env.NODE_ENV === "production";

@connect(
  ({ notes }) => ({ content: notes.content, error: notes.error }),
  { setContent, putFile, createNote },
)
export default class NewNote extends Component {
  static propTypes = {
    setContent: func.isRequired,
    putFile: func.isRequired,
    createNote: func.isRequired,
    history: historyProps,
    content: string,
    error: shape({
      msg: string,
      timestamp: number,
    }),
  }

  constructor(props) {
    super(props);
    this.onChangeDebounce = debounce(value => props.setContent(value), 250);
    this.state = {
      File: null,
      uploading: false,
      // need to set the initalState of content to sync with redux store
      content: props.content,
    };
  }

  debug = debug("new-note")

  componentDidMount() {
    this.textArea.focus();
  }

  componentWillUpdate = nProps => {
    const { error: { msg, timestamp } } = nProps;
    const { error } = this.props;

    if (msg && error.timestamp !== timestamp) {
      notification.error({ message: msg });

      !isProd && this.debug(msg); // eslint-disable-line
    }
  }

  render() {
    const { File, content, uploading } = this.state;

    return (
      <Row type="flex" justify="center">
        <Helmet>
          <title>Add Note</title>
        </Helmet>
        <Col xs={24} md={18} xl={8} className={styles.column}>
          <Input.TextArea
            rows={5}
            maxLength={140}
            wrap="soft"
            onChange={this.handleChange}
            ref={c => { this.textArea = c; }}
            placeholder="140 chars"
            value={content}
            onPressEnter={this.handleOnPressEnter}
          />
          <FileReaderInput
            as="binary"
            onChange={this.handleFileChange}
          >
            <Spin spinning={uploading}>
              <Button
                type={File ? "secondary" : "primary"}
                icon="file-add"
                disabled={!this.isValid()}
              >
                {File ? File.name : ""}
              </Button>
            </Spin>
          </FileReaderInput>
          <Row type="flex" justify="space-between">
            <Tooltip placement="bottom" title="Clear attachment">
              <Button
                type="secondary"
                icon="delete"
                onClick={() => { this.setState({ File: null }); }}
                disabled={!File || !this.isValid()}
              />
            </Tooltip>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              disabled={!this.isValid()}
              ref={c => { this.button = c; }}
            >
                Done
            </Button>
          </Row>
        </Col>
      </Row>
    );
  }

  isValid = () => {
    const { content } = this.props;
    const { uploading } = this.state;

    return content.length > 0 && !uploading;
  };

  handleChange = event => {
    event.preventDefault();
    const content = event.target.value;
    // controlled textfield's value needs to sync with local state for the UI to respond immediately
    // https://medium.com/@justintulk/debouncing-reacts-controlled-textareas-w-redux-lodash-4383084ca090
    this.setState({ content }, () => {
      // once we have it in the local state, we lift the state via a debounced redux action
      // if we didn't store the value in local state, display to the user would also be debounced
      this.onChangeDebounce(content);
    });
  }

  handleOnPressEnter = evt => {
    evt.preventDefault();
  }

  handleFileChange = (event, [data]) => {
    const [_, File] = data;

    if (File.size <= MAX_ATTACHMENT_SIZE) {
      this.setState({ File });
    } else {
      notification.error({
        message: `${File.name} exceeds maximum allowed size.`,
      });
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.isValid()) return;

    const { File } = this.state;
    const { content } = this.props;

    this.button.setState({ loading: true });
    const newNote = { content };

    if (File) {
      this.setState({ uploading: true });
      const response = await this.props.putFile(File);

      this.setState({ uploading: false });
      if (response.value) { // if upload was fulfilled
        newNote.attachment = response.value.key;
      } else {
        notification.warn({
          message: `${File.name} could not be uploaded.`,
          description: "Note will be created without attachment.",
          duration: 5,
        });
      }
    }

    try {
      await this.props.createNote(newNote);
    } catch (_) {
      this.button.setState({ loading: false });
      return;
    }

    this.props.history.push("/");
  }
}
