import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { number, func, string, shape, arrayOf } from "prop-types";
import { Row, notification } from "antd";
import { Loader } from "@doruk/components";
import { history as historyProps } from "react-router-prop-types";

import Note from "../components/Note";
import { getFile, listNotes, deleteNote } from "../state/actions/notes-actions";
import { noteShape, downloadFromUrl, delay } from "../util";

@connect(
  ({ notes }) => ({ notes: notes.all, error: notes.error }),
  { getFile, listNotes, deleteNote },
)
export default class Home extends Component {
  static propTypes = {
    notes: arrayOf(noteShape),
    error: shape({
      msg: string,
      timestamp: number,
    }),
    listNotes: func.isRequired,
    deleteNote: func.isRequired,
    getFile: func.isRequired,
    history: historyProps,
  }

  state = {
    isLoading: true
  }

  componentWillMount = async () => {
    try {
      this.setState({ isLoading: true });
      await Promise.race([
        this.props.listNotes(),
        delay(7000, { reject: true, reason: "TIMEOUT" })
      ]);
      this.setState({ isLoading: false });
    } catch (err) {
      if (/TIMEOUT/.test(err)) {
        notification.warning({ message: "Timed out. Please refresh." });
      } else {
        notification.warning({ message: err.message });
      }
    }
  }

  componentWillUpdate = nProps => {
    const {
      notes,
      error: { msg, timestamp }
    } = nProps;
    const { error } = this.props;

    if (!notes.length) {
      // fetched an empty list of notes
      this.props.history.push("/add");
    }

    if (msg && error.timestamp !== timestamp) {
      notification.error({ message: msg });
    }
  }

  render() {
    const { notes } = this.props;
    const { isLoading } = this.state;

    return (
      <Row type="flex" align="bottom">
        <Helmet>
          <title>Home</title>
        </Helmet>
        {isLoading
          ? <Loader
            fullscreen="rgba(255,255,0,.5)"
            fill="rebeccapurple"
            variant="rect5"
          />
          : this.renderNotes(notes)}
      </Row>
    );
  }

  renderNotes = notes => (
    <Fragment>
      {notes.map(note => (
        <Note
          key={note.noteId}
          {...note}
          onDelete={this.handleDelete}
          onDownload={this.handleDownload}
          onSelect={this.handleSelect}
        />
      ))}
    </Fragment>
  )

  handleDelete = noteId => this.props.deleteNote(noteId);

  handleDownload = async evt => {
    const { filename } = evt.target.dataset;
    const { value: presignedURL } = await this.props.getFile(filename);

    if (presignedURL) {
      downloadFromUrl(presignedURL);
    }
  }

  handleSelect = evt => {
    const { target, currentTarget } = evt;

    // exclude clicks from the actions bar (below content)
    if (target.classList.contains("ant-card-body")) {
      const { noteId } = currentTarget.dataset;
      this.props.history.push(`/edit/${noteId}`);
    }
  }
}
