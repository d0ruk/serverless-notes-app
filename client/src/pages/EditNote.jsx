import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Row, Col, notification, Input, Button } from "antd";
import { func, string } from "prop-types";
import debounce from "lodash/debounce";
import {
  history as historyProps,
  match as matchProps,
} from "react-router-prop-types";

import styles from "./EditNote.css";
import {
  getNote, updateNote, setContent, putFile
} from "../state/actions/notes-actions";
import { MAX_ATTACHMENT_SIZE, delay } from "../util";
import FileInput from "../components/FileInput";
import SelectColor from "../components/SelectColor";

@connect(
  ({ notes: { content } }) => ({ content }),
  { getNote, updateNote, setContent, putFile },
)
export default class EditNote extends Component {
  static propTypes = {
    content: string,
    getNote: func.isRequired,
    putFile: func.isRequired,
    updateNote: func.isRequired,
    setContent: func.isRequired,
    history: historyProps.isRequired,
    match: matchProps.isRequired,
  }

  constructor(props) {
    super(props);
    this.onChangeDebounce = debounce(value => props.setContent(value), 250);
    this.state = {
      isLoading: false,
      isDirty: false,
      selectedColor: "",
      initialNote: {}, // eslint-disable-line
      uploading: false,
      content: props.content || "",
      File: "",
    };
  }

  componentWillMount = async () => {
    const { noteId } = this.props.match.params;

    try {
      this.setState({ isLoading: true });
      const { value: initialNote } = await this.props.getNote(noteId);
      const selectedColor = initialNote.color;

      this.setState(() => ({
        isLoading: false,
        File: initialNote.attachment,
        selectedColor,
        initialNote
      }));
    } catch (err) {
      notification.error({ message: "Could not fetch note." });
      this.setState({ isLoading: false });
      this.props.history.push("/");
    }
  }

  componentDidMount() {
    this.textArea.focus();
  }

  componentWillReceiveProps = ({ content }) => {
    // setState() to trigger a re-render
    this.setState({ content });
  }

  render() {
    const {
      content, isLoading,
      File, selectedColor,
      uploading, isDirty,
    } = this.state;

    return (
      <Row type="flex" justify="center">
        <Helmet>
          <title>Edit Note</title>
        </Helmet>
        <Col xs={24} md={18} xl={8} className={styles.column}>
          <Input.TextArea
            disabled={isLoading}
            rows={5}
            maxLength={140}
            wrap="soft"
            onChange={this.handleContentChange}
            ref={c => { this.textArea = c; }}
            placeholder="140 chars"
            value={content}
            onPressEnter={this.handleOnPressEnter}
          />
          <FileInput
            onChange={this.handleFileChange}
            loading={uploading}
            File={File}
            clearFile={() => { this.setState({ File: null, isDirty: true }); }}
          />
          <Row type="flex" justify="space-between">
            <SelectColor
              value={{ key: selectedColor || "" }}
              className={styles.selectBox}
              disabled={!this.isValid()}
              onSelect={({ key } = {}) => {
                this.setState(() => ({ selectedColor: key, isDirty: true }));
              }}
            />
            <Button
              type="primary"
              onClick={this.handleSubmit}
              disabled={!isDirty || !this.isValid()}
              ref={c => { this.button = c; }}
            >
                Edit
            </Button>
          </Row>
        </Col>
      </Row>
    );
  }

  handleContentChange = event => {
    event.preventDefault();
    const content = event.target.value;

    this.setState({ content, isDirty: true }, () => {
      this.onChangeDebounce(content);
    });
  }

  handleOnPressEnter = evt => {
    if (evt.ctrlKey) {
      this.handleSubmit(evt);
    }

    evt.preventDefault();
  }

  isValid = () => {
    const { content } = this.props;
    const { uploading } = this.state;

    return content.length > 0 && !uploading;
  };

  handleFileChange = (event, [data]) => {
    const [_, File] = data; // eslint-disable-line

    if (File.size <= MAX_ATTACHMENT_SIZE) {
      this.setState({ File, isDirty: true });
    } else {
      notification.error({
        message: `${File.name} exceeds maximum allowed size.`,
      });
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    const { noteId } = this.props.match.params;
    const { File, selectedColor, isDirty } = this.state;
    const { content } = this.props;
    // we check the isDirty flag to catch false positives
    // and thus avoid an unnecessary request
    if (!isDirty && !this.isValid()) return;

    this.button.setState({ loading: true });

    const newNote = { content };

    // selectedColor is undefined if cleared
    // but backend (update fn) expects null value
    // to clear a key on the note 'entity'
    newNote.color = selectedColor || null;

    // if File is an instance from the FileReader API
    if (File && File.name) {
      this.setState({ uploading: true });
      const response = await this.props.putFile(File);

      if (response.value) {
        const filename = response.value.key;

        this.setState({ uploading: false, File: filename });
        newNote.attachment = filename;
      } else {
        notification.warn({
          message: `${File.name} could not be uploaded.`,
          description: "Note will be created without attachment.",
          duration: 3,
        });
      }
    } else if (File === null) {
      // attachment was cleared
      newNote.attachment = null;
    }

    try {
      await this.props.updateNote(noteId, newNote);
      await delay(1250);
      this.props.history.push("/");
    } catch (_) {
      this.button.setState({ loading: false });
      notification.error({
        message: "Note could not be updated",
        duration: 3,
      });
    }
  }
}
